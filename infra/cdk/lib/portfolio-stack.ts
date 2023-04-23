import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3 } from './s3';
import { CloudFront } from './cloudfront';

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3 = new S3(this, 's3');

    const cloudFront = new CloudFront(this, 'cloudFront', {
      staticWebsiteBucket: s3.staticWebsiteBucket,
      imageBucket: s3.imageBucket
    });
  }
}
