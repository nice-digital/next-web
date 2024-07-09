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
  name        = "NextWebOcelotCacheClear-${var.environment}"
  description = "Ocelot Cache Clear access to AWS services - ${var.environment}"

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
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

resource "aws_cloudwatch_log_group" "ocelot_cache_clear_log_group" {
  retention_in_days = 30
  skip_destroy      = true
  name_prefix       = "/aws/lambda/NextWebOcelotCacheClear-${var.environment}/"
}

data "archive_file" "ocelot_cache_clear" {
  type        = "zip"
  source_file = "${path.module}/../index.mjs"
  output_path = "${path.module}/../index.zip"
}

resource "aws_lambda_function" "ocelot_cache_clear" {
  function_name = "NextWebOcelotCacheClear-${var.environment}"
  description   = "NextWebOcelotCacheClear-${var.environment}"

  depends_on = [data.archive_file.ocelot_cache_clear]
  role       = aws_iam_role.ocelot_cache_clear_role.arn

  runtime = "nodejs20.x"
  handler = "index.handler"

  filename         = "../index.zip"
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

resource "aws_apigatewayv2_api" "ocelot_cache_clear_api" {
  name          = "NextWebOcelotCacheClear-${var.environment}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_deployment" "ocelot_cache_clear_deployment" {
  api_id      = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  description = "NextWeb Ocelot Clear Cache Deployment - ${var.environment}"

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_apigatewayv2_route.ocelot_cache_clear_route]
}

resource "aws_apigatewayv2_stage" "ocelot_cache_clear_stage" {
  api_id        = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  name          = var.environment
  deployment_id = aws_apigatewayv2_deployment.ocelot_cache_clear_deployment.id
}

resource "aws_apigatewayv2_integration" "ocelot_cache_clear_integration" {
  api_id           = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  integration_type = "AWS_PROXY"

  description        = "NextWebOcelotCacheClear-${var.environment}"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.ocelot_cache_clear.invoke_arn
}

resource "aws_apigatewayv2_route" "ocelot_cache_clear_route" {
  api_id    = aws_apigatewayv2_api.ocelot_cache_clear_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ocelot_cache_clear_integration.id}"
}

resource "aws_lambda_permission" "ocelot_cache_clear" {
  statement_id_prefix = "AllowLambdaExecutionFromNextWebOcelotCacheClear-"
  action              = "lambda:InvokeFunction"
  function_name       = aws_lambda_function.ocelot_cache_clear.arn
  principal           = "apigateway.amazonaws.com"
  source_arn          = "${aws_apigatewayv2_api.ocelot_cache_clear_api.execution_arn}/*"
  lifecycle {
    replace_triggered_by = [
      aws_lambda_function.ocelot_cache_clear
    ]
  }
}
