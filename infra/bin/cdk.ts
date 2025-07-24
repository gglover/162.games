#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";
import { CertificateStack } from "../lib/certificate-stack";

const app = new cdk.App();

const DOMAIN_NAME = "162.games";

const certStack = new CertificateStack(app, "CertificateStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
  domainName: DOMAIN_NAME,
  crossRegionReferences: true,
});

new CdkStack(app, "CdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  domainName: DOMAIN_NAME,
  certificateArn: certStack.certificate.certificateArn,
  crossRegionReferences: true,
});
