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
    tags = var.tags
  }
}

resource "aws_iam_role" "ocelot_cache_clear_role" {
  name                = var.role_name
  description         = var.role_description

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSLambda_FullAccess",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  ]
  assume_role_policy  = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = [
          "lambda.amazonaws.com",
          "apigateway.amazonaws.com"
        ]
      }
    }]
  })
}

module "ocelot-cache-clear_test" {
  source          = "../../modules/ocelot-cache-clear"
	depends_on = [aws_iam_role.ocelot_cache_clear_role]
  build           = var.build
  environment     = var.environment
  token_url       = var.token_url
  client_id       = var.client_id
  client_secret   = var.client_secret
  scope           = var.scope
  cache_clear_url = var.cache_clear_url
}
