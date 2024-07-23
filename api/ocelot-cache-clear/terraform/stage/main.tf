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
#  backend "s3" {
#    bucket = "next-web-ocelot-cache-clear-tfstate"
#    key    = "test.tfstate"
#    region = "eu-west-1"
#  }
  backend "s3" {
    bucket = "#{terraform_base_backend_s3bucket}"
    key    = "#{terraform_base_backend_statefolder}"
    region = "#{terraform_base_backend_region}"
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
  api_id      = data.aws_apigatewayv2_api.ocelot_cache_clear_api.id
  name        = var.environment == "" ? "$default" : var.environment
  auto_deploy = true
  stage_variables = {
    functionName = "NextWebOcelotCacheClear${var.environment == "" ? "" : "-${var.environment}"}"
  }
  depends_on = [
    aws_cloudwatch_log_group.ocelot_cache_clear_log_group
  ]
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.ocelot_cache_clear_log_group.arn
    format          = "$context.identity.sourceIp [$context.requestTime] \"$context.httpMethod $context.protocol\" $context.status $context.responseLength $context.requestId"
  }
  default_route_settings {
    throttling_burst_limit = 500
    throttling_rate_limit  = 1000
  }
}

data "aws_iam_policy_document" "invoke_function_policy_document" {
  depends_on = [
    aws_cloudwatch_log_group.ocelot_cache_clear_log_group
  ]
  statement {
    actions   = ["lambda:InvokeFunction"]
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
  name   = "NextWebOcelotCacheClear-${var.environment}_Invoke"
  policy = data.aws_iam_policy_document.invoke_function_policy_document.json
}

resource "aws_iam_role_policy_attachment" "attach_invoke_function" {
  role       = data.aws_iam_role.ocelot_cache_clear_role.id
  policy_arn = aws_iam_policy.invoke_function_policy.arn
}
