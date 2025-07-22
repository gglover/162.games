import { Stack, StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import path from "path";
import fs from "fs";

export interface StatsLambdaProps {
  publicBucket: s3.Bucket;
  distributionId: string;
}

export class StatsLambda extends Construct {
  constructor(parent: Stack, name: string, props: StatsLambdaProps) {
    super(parent, name);

    const scheduleDataBucket = new s3.Bucket(this, "ScheduleDataBucket", {
      bucketName: "mlb-schedule-data-bucket",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Statically deploy teams.json to private schedule bucket.
    // This file is also built into the frontend bundle.
    const teamsJsonContent = fs.readFileSync(
      path.join(__dirname, "../../data/teams.json"),
      "utf-8"
    );

    new s3deploy.BucketDeployment(this, "DeployFile", {
      sources: [s3deploy.Source.data("teams.json", teamsJsonContent)],
      destinationBucket: scheduleDataBucket,
    });

    new CfnOutput(this, "Bucket", { value: scheduleDataBucket.bucketName });

    // Will package up handler and deps from requirements.txt.
    //
    const dailyLambda = new PythonFunction(this, "DailyScheduleLambda", {
      entry: path.join(__dirname, "../../scripts"),
      runtime: lambda.Runtime.PYTHON_3_9,
      index: "handler.py",
      handler: "lambda_handler",
      environment: {
        SCHEDULE_DATA_BUCKET: scheduleDataBucket.bucketName,
        PUBLIC_BUCKET: props.publicBucket.bucketName,
        CF_DISTRIBUTION_ID: props.distributionId,
      },
      timeout: Duration.minutes(10),
      memorySize: 256,
    });

    new CfnOutput(this, "Lambda", { value: dailyLambda.functionName });

    // Create EventBridge rule for 1 AM PT (8 AM UTC) from March to October
    const rule = new events.Rule(this, "Daily1amPTMarchToOctRule", {
      schedule: events.Schedule.cron({
        minute: "0",
        hour: "8", // 8 AM UTC == 1 AM PT during DST
        month: "3-10", // March to October
        weekDay: "*",
      }),
    });

    rule.addTarget(new targets.LambdaFunction(dailyLambda));

    dailyLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: ["*"], // Ideally restrict this
      })
    );

    scheduleDataBucket.grantReadWrite(dailyLambda);
    props.publicBucket.grantReadWrite(dailyLambda);
  }
}
