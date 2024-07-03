variable "aws_region" {
  type    = string
}

variable "tags" {
  type    = map(string)
  default = {
    Terraform = "true"
    Service   = "NextWebOcelotCacheClear"
  }
}

variable "role_name" {
  type    = string
  default = "NextWebOcelotCacheClear"
}

variable "role_description" {
  type    = string
  default = "Ocelot Cache Clear access to AWS services"
}

variable "api_name" {
  type    = string
  default = "NextWebOcelotCacheClear"
}
