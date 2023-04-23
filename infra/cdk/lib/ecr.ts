import { Construct } from 'constructs';
import { 
  aws_ecr as ecr
} from 'aws-cdk-lib';

export class ECR extends Construct {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    new ecr.Repository(this, 'nginx');
    new ecr.Repository(this, 'php');
    new ecr.Repository(this, 'mysql');
  }
}