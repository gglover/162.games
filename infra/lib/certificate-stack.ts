// lib/certificate-stack.ts
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

// Satisfies requirement that acm certs be issued in us-east-1
//
export class CertificateStack extends Stack {
  public readonly certificate: acm.ICertificate;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { domainName: string }
  ) {
    super(scope, id, {
      ...props,
      env: { region: "us-east-1", account: props.env?.account },
    });

    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: props.domainName,
    });

    const cert = new acm.Certificate(this, "SiteCertificate", {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    this.certificate = cert;
  }
}
