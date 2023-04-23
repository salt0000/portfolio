import { Construct } from 'constructs';
import { 
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_certificatemanager as certificatemanager,
  aws_iam as iam,
  Duration
} from 'aws-cdk-lib';

export interface Props {
  staticWebsiteBucket: s3.Bucket
  imageBucket: s3.Bucket
}

export class CloudFront extends Construct {
  
  readonly staticWebsiteDistribution: cloudfront.Distribution;
  readonly imageDistribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const oai = new cloudfront.OriginAccessIdentity(this, 'originAccessIdentity');
    const domainName = 'saltportfolio.net';
    const certificate = certificatemanager.Certificate.fromCertificateArn(this, 'domainCert', 'acm_arn')

    // S3のポリシーにOAIの設定
    props.staticWebsiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [oai.grantPrincipal],
        resources: [`${props.staticWebsiteBucket.bucketArn}/*`],
      })
    );
    props.imageBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [oai.grantPrincipal],
        resources: [`${props.imageBucket.bucketArn}/*`],
      })
    );

    this.staticWebsiteDistribution = new cloudfront.Distribution(this, 'staticWebsiteDistribution', {
      comment:  `Delivery static website`,
      domainNames: [domainName],
      certificate: certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(props.staticWebsiteBucket, {
          originAccessIdentity: oai
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          ttl: Duration.minutes(30),
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ]
    });

    this.imageDistribution = new cloudfront.Distribution(this, 'imageDistribution', {
      comment:  `Delivery images`,
      domainNames: ['image.' + domainName],
      certificate: certificate,
      defaultBehavior: {
        origin: new origins.S3Origin(props.imageBucket, {
          originAccessIdentity: oai
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    });
  }
}