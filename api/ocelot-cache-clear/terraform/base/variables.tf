variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "tags" {
  type    = map(string)
  default = {
    Terraform = "true"
    Service   = "OcelotCacheClear"
  }
}

variable "role_name" {
  type    = string
  default = "OcelotCacheClear"
}

variable "role_description" {
  type    = string
  default = "Ocelot Cache Clear access to AWS services"
}

variable "api_name" {
  type    = string
  default = "OcelotCacheClear"
}