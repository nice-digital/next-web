variable "environment" {
  type = string
  default = "test"
}

variable "aws_region" {
  type = string
}

variable "role_description" {
  type    = string
  default = "Ocelot Cache Clear access to AWS services"
}

variable "token_url" {
    type = string
}

variable "client_id" {
    type = string
}

variable "client_secret" {
    type = string
}

variable "scope" {
    type = string
}

variable "cache_clear_url" {
    type = string
}
