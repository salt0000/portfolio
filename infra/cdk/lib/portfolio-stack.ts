import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3 } from './s3';

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3 = new S3(this, 's3');
  }
}
