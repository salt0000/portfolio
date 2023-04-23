import { Construct } from 'constructs';
import {
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_cloudfront as cloudFront,
  aws_elasticloadbalancingv2 as elb,
  RemovalPolicy
} from 'aws-cdk-lib';

export interface Props{
  staticWebsiteDistribution: cloudFront.Distribution;
  imageDistribution: cloudFront.Distribution;
  alb: elb.ApplicationLoadBalancer;
}

export class Route53 extends Construct {

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: 'hostedZoneId',
      zoneName: 'saltportfolio.net'
    });

    new route53.ARecord(this, 'staticWebsiteDistributionARecord', {
      zone: hostedZone,
      recordName: 'saltportfolio.net',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(props.staticWebsiteDistribution)),
    }).applyRemovalPolicy(RemovalPolicy.DESTROY);

    new route53.ARecord(this, 'imageDistributionARecord', {
      zone: hostedZone,
      recordName: "image.saltportfolio.net",
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(props.imageDistribution)),
    }).applyRemovalPolicy(RemovalPolicy.DESTROY);

    new route53.ARecord(this, 'albArecord', {
      zone: hostedZone,
      recordName: 'api.saltportfolio.net',
      target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(props.alb)),
    }).applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}