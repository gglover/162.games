import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

export class StatsLambda extends Construct {
  constructor(parent: Stack, name: string, props?: StackProps) {
    super(parent, name);

    // // Define the Lambda function
    // const dailyLambda = new lambda.Function(this, "DailyLambda", {
    //   runtime: lambda.Runtime.PYTHON_3_9,
    //   handler: "index.handler",
    //   code: lambda.Code.fromAsset("lambda"), // what's the path...?
    //   timeout: Duration.minutes(10),
    // });

    // // Create EventBridge rule for 1 AM PT (8 AM UTC) from March to October
    // const rule = new events.Rule(this, "Daily1amPTMarchToOctRule", {
    //   schedule: events.Schedule.cron({
    //     minute: "0",
    //     hour: "8", // 8 AM UTC == 1 AM PT during DST
    //     month: "3-10", // March to October
    //     weekDay: "*",
    //   }),
    // });

    // // Add Lambda as target
    // rule.addTarget(new targets.LambdaFunction(dailyLambda));
  }
}
