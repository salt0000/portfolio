import { Construct } from 'constructs';
import { 
  aws_ec2 as ec2,
  aws_elasticloadbalancingv2 as elb,
  Duration,
  Tags,
} from 'aws-cdk-lib';

export interface Props {
  vpc: ec2.Vpc
}

export class ALB extends Construct {
  
  readonly alb: elb.ApplicationLoadBalancer;
  readonly securityGroup: ec2.SecurityGroup;
  readonly targetGroup: elb.ApplicationTargetGroup;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc
    });
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(80));
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(443));
    Tags.of(this.securityGroup).add('Name', 'alb-sg');

    this.targetGroup = new elb.ApplicationTargetGroup(this, 'ApplicationTargetGroup', {
      vpc: props.vpc,
      protocol: elb.ApplicationProtocol.HTTP,
      targetType: elb.TargetType.INSTANCE,
      deregistrationDelay: Duration.minutes(1)
    });

    this.alb = new elb.ApplicationLoadBalancer(this, 'ApplicationLoadBalancer', {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: this.securityGroup,
      vpcSubnets: { 
        subnets: props.vpc.publicSubnets
      }
    });
    this.alb.addListener('ListenerHttp', {
      protocol: elb.ApplicationProtocol.HTTP,
      defaultAction: elb.ListenerAction.redirect({
        protocol: 'HTTPS',
        host: '#{host}',
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true
      })
    });
    this.alb.addListener('ListenerHttps', {
      protocol: elb.ApplicationProtocol.HTTPS,
      certificates: [elb.ListenerCertificate.fromArn('acm_arn')],
      defaultTargetGroups: [this.targetGroup]
    });
  }
}