import { Construct } from 'constructs';
import { 
  Stack,
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipeline_actions,
  aws_codebuild as codebuild,
  aws_s3 as s3,
  aws_iam as iam,
  aws_cloudfront as cloudfront,
  aws_logs as logs,
  RemovalPolicy
} from 'aws-cdk-lib';
import { readFileSync } from 'fs';
const jsYaml = require('js-yaml');

export interface CodePipelineFrontEndProps{
  staticWebsiteBucket: s3.IBucket;
  staticWebsiteDistribution: cloudfront.Distribution;
  codePipelineArtifactBucket: s3.IBucket;
}

export class CodePipelineFrontEnd extends Construct {
  constructor(scope: Construct, id: string, props: CodePipelineFrontEndProps) {
    super(scope, id);

    const sourceOutput = new codepipeline.Artifact('frontend_source_output');

    const codeStarConnectionsSourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'getGitHubSource',
      connectionArn: 'acm_arn',
      owner: 'salt0000',
      repo: 'portfolio',
      branch: 'main',
      output: sourceOutput
    });

    const codeBuildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'buildAndDeploy',
      input: sourceOutput,
      project: this.createCodeBuild(props.staticWebsiteBucket, props.staticWebsiteDistribution)
    });

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: props.codePipelineArtifactBucket,
      crossAccountKeys: false
    });
    pipeline.addStage({
      stageName: 'codeStarConnectionsSource',
      actions: [codeStarConnectionsSourceAction]
    });
    pipeline.addStage({
      stageName: 'buildAndDeploy',
      actions: [codeBuildAction]
    });
  }

  private createCodeBuild(staticWebsiteBucket: s3.IBucket, staticWebsiteDistribution: cloudfront.Distribution ): codebuild.PipelineProject {
    const buildspec = readFileSync('./lib/codepipeline/front-end/buildspec.yaml', 'utf-8');
    const buildspecYaml = jsYaml.load(buildspec);
    
    const buildProject = new codebuild.PipelineProject(this, 'pipelineProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      },
      logging: {
        cloudWatch: {
          logGroup: new logs.LogGroup(this, 'logGroup', {
            removalPolicy: RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.THREE_MONTHS
          })
        }
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml(buildspecYaml),
      environmentVariables: {
        'S3_BUCKET_NAME': {
          value: `${staticWebsiteBucket.bucketName}`,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
        },
        'CLOUDFRONT_DISTRIBUTION_ID': {
          value: `${staticWebsiteDistribution.distributionId}`,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
        }
      }
    });
    buildProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:List*',
        's3:DeleteObject*',
        's3:PutObject*'
      ],
      resources: [
        `${staticWebsiteBucket.bucketArn}`,
        `${staticWebsiteBucket.bucketArn}/*`,
      ],
    }));
    buildProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cloudfront:CreateInvalidation',
      ],
      resources: [
        `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${staticWebsiteDistribution.distributionId}`,
      ]
    }));

    return buildProject;
  }
}