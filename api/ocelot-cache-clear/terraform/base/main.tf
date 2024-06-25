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

module "api_gateway" {
  source         = "../modules/aws-api-gateway"
  api_name       = var.api_name
}