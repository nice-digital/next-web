variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "tags" {
  type = map(string)
  default = {
    Terraform = "true"
    Service   = "NextWebOcelotCacheClear"
  }
}

variable "api_name" {
  type    = string
  default = "NextWebOcelotCacheClear"
}

variable "environment" {
  type = string
  default = "test"
}

variable "build" {
  type = string
  default = "1"
}

variable "ocelot_cache_clear_role" {
  type = string
  default = "OcelotCacheClear"
}

variable "token_url" {
    type = string
    default = "tokenURL"
}

variable "client_id" {
    type = string
    default = "client_id"
}

variable "client_secret" {
    type = string
    default = "client_secret"
}

variable "scope" {
    type = string
    default = "scope"
}

variable "cache_clear_url" {
    type = string
    default = "cache_clear_url"
}
