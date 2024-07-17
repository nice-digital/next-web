terraform {
  required_version = ">= 0.13"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.43.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "2.4.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Terraform = "true"
      Service   = "NextWebOcelotCacheClear"
    }
  }
}

resource "aws_iam_role" "ocelot_cache_clear_role" {
  name        = "NextWebOcelotCacheClear"
  description = "Next Web Ocelot Cache Clear access to AWS services"

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  ]
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = [
          "lambda.amazonaws.com",
          "apigateway.amazonaws.com"
        ]
      }
    }]
  })
}

resource "aws_apigatewayv2_api" "ocelot_cache_clear_api" {
  name          = "NextWebOcelotCacheClear"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "ocelot_cache_clear_integration" {
  api_id           = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  integration_type = "AWS_PROXY"

  description        = "NextWebOcelotCacheClear"
  integration_method = "POST"
  integration_uri    = "arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:$${stageVariables.functionName}"
	credentials_arn    = aws_iam_role.ocelot_cache_clear_role.arn
}

resource "aws_apigatewayv2_route" "ocelot_cache_clear_route" {
  api_id    = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ocelot_cache_clear_integration.id}"
}

//Full debug log format
//accountId: $context.accountId / apiId: $context.apiId / authorizer.claims.property: $context.authorizer.claims.property / authorizer.error: $context.authorizer.error / authorizer.principalId: $context.authorizer.principalId / authorizer.property: $context.authorizer.property / awsEndpointRequestId: $context.awsEndpointRequestId / awsEndpointRequestId2: $context.awsEndpointRequestId2 / customDomain.basePathMatched: $context.customDomain.basePathMatched / dataProcessed: $context.dataProcessed / domainName: $context.domainName / domainPrefix: $context.domainPrefix / error.message: $context.error.message / error.messageString: $context.error.messageString / error.responseType: $context.error.responseType / extendedRequestId: $context.extendedRequestId / httpMethod: $context.httpMethod / identity.accountId: $context.identity.accountId / identity.caller: $context.identity.caller / identity.cognitoAuthenticationProvider: $context.identity.cognitoAuthenticationProvider / identity.cognitoAuthenticationType: $context.identity.cognitoAuthenticationType / identity.cognitoIdentityId: $context.identity.cognitoIdentityId / identity.cognitoIdentityPoolId: $context.identity.cognitoIdentityPoolId / identity.principalOrgId: $context.identity.principalOrgId / identity.clientCert.clientCertPem: $context.identity.clientCert.clientCertPem / identity.clientCert.subjectDN: $context.identity.clientCert.subjectDN / identity.clientCert.issuerDN: $context.identity.clientCert.issuerDN / identity.clientCert.serialNumber: $context.identity.clientCert.serialNumber / identity.clientCert.validity.notBefore: $context.identity.clientCert.validity.notBefore / identity.clientCert.validity.notAfter: $context.identity.clientCert.validity.notAfter / identity.sourceIp: $context.identity.sourceIp / identity.user: $context.identity.user / identity.userAgent: $context.identity.userAgent / identity.userArn: $context.identity.userArn / integration.error: $context.integration.error / integration.integrationStatus: $context.integration.integrationStatus / integration.latency: $context.integration.latency / integration.requestId: $context.integration.requestId / integration.status: $context.integration.status / integrationErrorMessage: $context.integrationErrorMessage / integrationLatency: $context.integrationLatency / integrationStatus: $context.integrationStatus / path: $context.path / protocol: $context.protocol / requestId: $context.requestId / requestTime: $context.requestTime / requestTimeEpoch: $context.requestTimeEpoch / responseLatency: $context.responseLatency / responseLength: $context.responseLength / routeKey: $context.routeKey / stage: $context.stage / status: $context.status

/*

Terraform is designed to manage infrastructure with a desired state configuration, which means that changes to the configuration can lead to the recreation of resources to match the new desired state. However, there are ways to manage multiple environments without destroying the existing ones.

One approach is to use Terraform workspaces. Workspaces allow you to maintain separate state files for different environments within the same Terraform configuration. You can create a new workspace for each environment, which will hold its own state and resources independently of the others1.

Here’s a basic example of how to create a new workspace:

terraform workspace new <environment_name>

This command will create and switch to a new workspace named <environment_name>, where you can apply your Terraform configurations without affecting the resources in other workspaces.

Another method is to use resource targeting, which allows you to apply changes to only specific resources. However, this approach should be used with caution as it can lead to a drift in the state file if not managed properly.

For your specific case of API Gateway stages and Lambda functions, you might consider structuring your Terraform configuration to use modules. Each module can be designed to handle a specific stage and its associated resources, allowing you to deploy new stages without impacting the existing ones.

Remember to always review the terraform plan output before applying changes to ensure that only the expected actions (like creating new resources without destroying the old ones) are performed.

If you’re looking for more detailed guidance or examples, I recommend checking out the Terraform documentation or community forums where similar use cases and solutions are discussed23. Always ensure that your approach aligns with best practices for managing infrastructure as code.

*/
