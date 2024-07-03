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

module "ocelot-cache-clear_test" {
  source          = "../../modules/ocelot-cache-clear"
  build           = var.build
  environment     = var.environment
  token_url       = var.token_url
  client_id       = var.client_id
  client_secret   = var.client_secret
  scope           = var.scope
  cache_clear_url = var.cache_clear_url
}
