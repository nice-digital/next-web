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

data "aws_iam_role" "ocelot_cache_clear_role" {
	name = "NextWebOcelotCacheClear"
}

data "aws_apigatewayv2_apis" "ocelot_cache_clear_apis" {
	name = "NextWebOcelotCacheClear"
}

data "aws_apigatewayv2_api" "ocelot_cache_clear_api" {
	api_id = element(tolist(data.aws_apigatewayv2_apis.ocelot_cache_clear_apis.ids), 0)
}

data "archive_file" "ocelot_cache_clear" {
  type        = "zip"
  source_file = "${path.module}/../../index.mjs"
  output_path = "${path.module}/../../index.zip"
}

resource "aws_cloudwatch_log_group" "ocelot_cache_clear_log_group" {
  retention_in_days = 30
  skip_destroy      = true
  name_prefix       = "/aws/lambda/NextWebOcelotCacheClear-${var.environment}/"
}

resource "aws_lambda_function" "ocelot_cache_clear" {
  function_name = "NextWebOcelotCacheClear-${var.environment}"
  description   = "NextWebOcelotCacheClear-${var.environment}"

  depends_on = [data.archive_file.ocelot_cache_clear]
  role       = data.aws_iam_role.ocelot_cache_clear_role.arn

  runtime = "nodejs20.x"
  handler = "index.handler"

  filename         = "../../index.zip"
  source_code_hash = data.archive_file.ocelot_cache_clear.output_base64sha256
  timeout          = 10

  environment {
    variables = {
      cache_clear_url = var.cache_clear_url
      client_id       = var.client_id
      client_secret   = var.client_secret
      scope           = var.scope
      token_url       = var.token_url
    }
  }

  logging_config {
    log_group             = aws_cloudwatch_log_group.ocelot_cache_clear_log_group.id
    log_format            = "JSON"
    system_log_level      = "INFO"
    application_log_level = "INFO"
  }
}

resource "aws_apigatewayv2_stage" "ocelot_cache_clear_stage" {
  api_id        = data.aws_apigatewayv2_api.ocelot_cache_clear_api.id
  name          = var.environment == "" ? "$default" : var.environment
  auto_deploy   = true
  stage_variables = {
    functionName = "NextWebOcelotCacheClear${var.environment == "" ? "" : "-${var.environment}"}"
  }
	depends_on    = [
    aws_cloudwatch_log_group.ocelot_cache_clear_log_group
  ]
	access_log_settings {
    destination_arn = aws_cloudwatch_log_group.ocelot_cache_clear_log_group.arn
    format          = "$context.identity.sourceIp [$context.requestTime] \"$context.httpMethod $context.protocol\" $context.status $context.responseLength $context.requestId"
  }
}

data "aws_iam_policy_document" "invoke_function_policy_document" {
	depends_on    = [
    aws_cloudwatch_log_group.ocelot_cache_clear_log_group
  ]
  statement {
    actions = ["lambda:InvokeFunction"]
    resources = ["arn:aws:lambda:eu-west-1:${var.aws_account_id}:function:NextWebOcelotCacheClear-${var.environment}"]
  }
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["${aws_cloudwatch_log_group.ocelot_cache_clear_log_group.arn}:*"]
  }
}

resource "aws_iam_policy" "invoke_function_policy" {
  name        = "NextWebOcelotCacheClear-${var.environment}_Invoke"
  policy      = data.aws_iam_policy_document.invoke_function_policy_document.json
}

resource "aws_iam_role_policy_attachment" "attach_invoke_function" {
  role       = data.aws_iam_role.ocelot_cache_clear_role.id
  policy_arn = aws_iam_policy.invoke_function_policy.arn
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
