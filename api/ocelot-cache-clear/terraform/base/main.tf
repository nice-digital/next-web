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
#    key    = "base.tfstate"
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

resource "aws_iam_role" "ocelot_cache_clear_role" {
  name        = "NextWebOcelotCacheClear"
  description = "Next Web Ocelot Cache Clear access to AWS services"
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
