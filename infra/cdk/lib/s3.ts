import { Construct } from 'constructs';
import {
  aws_s3 as s3,
  RemovalPolicy
} from 'aws-cdk-lib';

export class S3 extends Construct {

  staticWebsiteBucket: s3.Bucket;
  imageBucket: s3.Bucket;
  codePipelineArtifactBucket: s3.Bucket;
  
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.staticWebsiteBucket = new s3.Bucket(this, 'staticWebsiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    this.imageBucket = new s3.Bucket(this, 'imageBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

    this.codePipelineArtifactBucket = new s3.Bucket(this, 'codePipelineArtifactBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });

  }
}