import { Construct } from 'constructs';
import { 
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_iam as iam,
  aws_logs as logs,
  aws_elasticloadbalancingv2 as elb,
  aws_autoscaling as autoscaling,
  RemovalPolicy,
} from 'aws-cdk-lib';

export interface Props {
  vpc: ec2.Vpc
  albTG: elb.ApplicationTargetGroup
  albSG: ec2.SecurityGroup
}

export class ECS extends Construct {
  
  readonly service: ecs.Ec2Service;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    // clusterの設定
    // autoScalingは使わないが、cdkの都合上設定しないといけないので設定している
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      minCapacity: 0,
      maxCapacity: 1,
    });
    const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
      autoScalingGroup,
    });
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc: props.vpc
    });
    cluster.addAsgCapacityProvider(capacityProvider);
    
    const ec2Instance = this.createEC2(props.vpc, props.albSG);
    ec2Instance.addUserData(
      `echo ECS_CLUSTER=${cluster.clusterName} > /etc/ecs/ecs.config`
    );

    new ecr.Repository(this, 'nginx', {
      repositoryName: 'portfolio-nginx',
      autoDeleteImages: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new ecr.Repository(this, 'php', {
      repositoryName: 'portfolio-php',
      autoDeleteImages: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new ecr.Repository(this, 'mysql', {
      repositoryName: 'portfolio-mysql',
      autoDeleteImages: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const taskDefinition = this.createTaskDefinition();
    
    this.service = new ecs.Ec2Service(this, 'EC2Service', {
      cluster: cluster,
      taskDefinition: taskDefinition
    });
    this.service.attachToApplicationTargetGroup(props.albTG);
  }

  private createTaskDefinition(): ecs.TaskDefinition {

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'taskDefinition', {
      taskRole: new iam.Role(this, 'taskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSESFullAccess'),
        ]
      }),
      executionRole: new iam.Role(this, 'taskExectionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
        ]
      }),
    });
    taskDefinition.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const awsLogDriver = new ecs.AwsLogDriver({
      logGroup: new logs.LogGroup(this, 'logGroup', {
        removalPolicy: RemovalPolicy.DESTROY
      }),
      streamPrefix: 'container',
    });
  
    const nginxContainer = taskDefinition.addContainer('nginxContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
      containerName: 'nginx',
      memoryReservationMiB: 100,
      logging: awsLogDriver,
      portMappings: [
        {
          hostPort: 0,
          containerPort: 80
        }
      ],
    });
    
    const phpContainer = taskDefinition.addContainer('phpContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx'),
      containerName: 'php',
      memoryReservationMiB: 100,
      logging: awsLogDriver
    });
    nginxContainer.addLink(phpContainer, 'php');
  
    // 環境変数に関しては後でparameter storeから取得できるようにする
    const mysqlContainer = taskDefinition.addContainer('mysqlContainer', {
      image: ecs.ContainerImage.fromRegistry('mysql:8.0.32'),
      containerName: 'mysql',
      memoryReservationMiB: 100,
      logging: awsLogDriver,
      environment: {
        MYSQL_DATABASE : 'portfolio',
        MYSQL_ROOT_PASSWORD : 'secret',
        TZ : 'Asia/Tokyo',
      },
    });
    phpContainer.addLink(mysqlContainer, 'mysql');

    return taskDefinition;
  }

  private createEC2(vpc : ec2.Vpc, albSG : ec2.SecurityGroup): ec2.Instance {
    const ec2SG = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc
    });
    ec2SG.addIngressRule(albSG, ec2.Port.allTcp());

    return new ec2.Instance(this, 'ec2Instance', {
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      role: new iam.Role(this, 'role', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role'),
        ]
      }),
      securityGroup: ec2SG,
      keyName: 'salt-portfolio',
      vpc: vpc,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      }
    });
  }
}