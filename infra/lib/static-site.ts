import * as route53 from "aws-cdk-lib/aws-route53";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnOutput, Duration, RemovalPolicy, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import path = require("path");

export interface StaticSiteProps {
  domainName: string;
  certificateArn: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  public readonly publicBucket: s3.Bucket;
  public readonly distributionId: string;

  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name);

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: props.domainName,
    });

    new CfnOutput(this, "Site", { value: "https://" + props.domainName });

    // Content bucket
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: props.domainName,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [s3.HttpMethods.GET],
          exposedHeaders: ["ETag"],
        },
      ],

      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.publicBucket = siteBucket;
    new CfnOutput(this, "Bucket", { value: siteBucket.bucketName });

    // TLS certificate
    // const certificate = new acm.Certificate(this, "SiteCertificate", {
    //   domainName: props.domainName,
    //   validation: acm.CertificateValidation.fromDns(zone),
    // });

    // const certificate = new acm.DnsValidatedCertificate(this, "SiteCert", {
    //   domainName: "yourdomain.com",
    //   hostedZone: hostedZone,
    //   region: "us-east-1",
    // });
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "ImportedCert",
      props.certificateArn
    );

    new CfnOutput(this, "Certificate", { value: certificate.certificateArn });

    const allowAllOriginCachePolicy = new cloudfront.CachePolicy(
      this,
      "AllowAllOriginCachePolicy",
      {
        cachePolicyName: "AllowAllOriginCachePolicy",
        headerBehavior: cloudfront.CacheHeaderBehavior.allowList("Origin"),
        defaultTtl: Duration.days(1),
        minTtl: Duration.hours(1),
        maxTtl: Duration.days(2),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      }
    );

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      certificate: certificate,
      defaultRootObject: "index.html",
      domainNames: [props.domainName],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      defaultBehavior: {
        origin:
          cloudfront_origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: allowAllOriginCachePolicy,
        responseHeadersPolicy:
          cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    this.distributionId = distribution.distributionId;

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: props.domainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset(path.join(__dirname, "../../site/dist"))],
      destinationBucket: siteBucket,
      prune: false,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
