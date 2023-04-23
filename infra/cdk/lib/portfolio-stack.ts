import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3 } from './s3';
import { CloudFront } from './cloudfront';
import { ALB } from './alb';
import { ECS } from './ecs';
import { CodePipelineFrontEnd } from './codepipeline/front-end/codepipeline-front-end';
import { CodePipelineBackEnd } from './codepipeline/back-end/codepipeline-back-end';
import { Route53 } from './route53';

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const s3 = new S3(this, 's3');
    const cloudFront = new CloudFront(this, 'cloudFront', {
      staticWebsiteBucket: s3.staticWebsiteBucket,
      imageBucket: s3.imageBucket
    });

    const vpc = new cdk.aws_ec2.Vpc(this, 'vpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'Public',
          cidrMask: 24,
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC
        }
      ]
    });
    const alb = new ALB(this, 'alb', {
      vpc: vpc
    });
    const ecs = new ECS(this, 'ecs', {
      vpc: vpc,
      albTG: alb.targetGroup,
      albSG: alb.securityGroup,
    });

    new CodePipelineFrontEnd(this, 'codePipelineFrontEnd', {
      staticWebsiteBucket: s3.staticWebsiteBucket,
      staticWebsiteDistribution: cloudFront.staticWebsiteDistribution,
      codePipelineArtifactBucket: s3.codePipelineArtifactBucket,
    });
    new CodePipelineBackEnd(this, 'codePipelineBackEnd', {
      ecsService: ecs.service,
      codePipelineArtifactBucket: s3.codePipelineArtifactBucket,
    });

    new Route53(this, 'route53', {
      staticWebsiteDistribution: cloudFront.staticWebsiteDistribution,
      imageDistribution: cloudFront.imageDistribution,
      alb: alb.alb,
    });
  }
}
