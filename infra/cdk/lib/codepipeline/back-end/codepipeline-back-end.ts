import { Construct } from 'constructs';
import { 
  Stack,
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipeline_actions,
  aws_codebuild as codebuild,
  aws_s3 as s3,
  aws_iam as iam,
  aws_ecs as ecs,
  aws_logs as logs,
  RemovalPolicy
} from 'aws-cdk-lib';
import { readFileSync } from 'fs';
const jsYaml = require('js-yaml');

export interface CodePipelineBackEndProps{
  ecsService: ecs.Ec2Service;
  codePipelineArtifactBucket: s3.IBucket;
}

export class CodePipelineBackEnd extends Construct {
  constructor(scope: Construct, id: string, props: CodePipelineBackEndProps) {
    super(scope, id);

    const sourceOutput = new codepipeline.Artifact('Backend_source_output');
    const buildOutput = new codepipeline.Artifact('Backend_build_output');

    const codeStarConnectionsSourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'getGitHubSource',
      connectionArn: 'acm_arn',
      owner: 'salt0000',
      repo: 'portfolio',
      branch: 'main',
      output: sourceOutput
    });

    const codeBuildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'codeBuildAction',
      input: sourceOutput,
      project: this.createCodeBuild(),
      outputs: [buildOutput]
    });

    const ecsDeployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'ecsDeploy',
      input: buildOutput,
      service: props.ecsService
    });

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: props.codePipelineArtifactBucket,
      crossAccountKeys: false
    });    
    pipeline.addStage({
      stageName: 'Source',
      actions: [codeStarConnectionsSourceAction]
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [codeBuildAction]
    });
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [ecsDeployAction]
    });
  }

  private createCodeBuild(): codebuild.PipelineProject {
    // 開発の時はpostgreをbuild&pushするが、本番ではしない
    const buildspecYaml = jsYaml.load(readFileSync('./lib/codepipeline/back-end/buildspec.yaml', 'utf-8'));
    
    const buildProject = new codebuild.PipelineProject(this, 'PipelineProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true
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
        'AWS_ACCOUNT_ID': {
          value: Stack.of(this).account,
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
        },
        'SERVICE_NAME': {
          value: 'portfolio',
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
        },
        'LARAVEL_ENV': {
          value: '/laravel/env',
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
        },
        'DOCKER_HUB_ID': {
          value: '/dockerhub/id',
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        },
        'DOCKER_HUB_PASSWORD': {
          value: '/dockerhub/password',
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        }
      }
    });
    buildProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'imagebuilder:GetComponent',
        'imagebuilder:GetContainerRecipe',
        'ecr:GetAuthorizationToken',
        'ecr:BatchGetImage',
        'ecr:InitiateLayerUpload',
        'ecr:UploadLayerPart',
        'ecr:CompleteLayerUpload',
        'ecr:BatchCheckLayerAvailability',
        'ecr:GetDownloadUrlForLayer',
        'ecr:PutImage',
        'ssm:GetParameter'
      ],
      resources: ['*'],
    }));

    return buildProject;
  }
}