import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib";
import { StaticSite } from "./static-site";
import { StatsLambda } from "./stats-lambda";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticSite = new StaticSite(this, "site", {
      siteSubDomain: "www",
      domainName: "baseball.com",
    });

    new StatsLambda(this, "stats-lambda", {
      publicBucket: staticSite.publicBucket,
      distributionId: staticSite.distributionId,
    });
  }
}
