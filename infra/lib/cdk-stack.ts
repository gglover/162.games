import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib";
import { StaticSite } from "./static-site";
import { StatsLambda } from "./stats-lambda";

export interface CdkStackProps extends cdk.StackProps {
  domainName: string;
  certificateArn: string;
}

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    const staticSite = new StaticSite(this, "site", {
      domainName: props.domainName,
      certificateArn: props.certificateArn,
    });

    new StatsLambda(this, "stats-lambda", {
      publicBucket: staticSite.publicBucket,
      distributionId: staticSite.distributionId,
    });
  }
}
