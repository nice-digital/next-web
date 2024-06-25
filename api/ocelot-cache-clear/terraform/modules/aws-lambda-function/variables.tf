variable "environment" {
  type = string
  default = "test"
}

variable "build" {
  type = string
  default = "1"
}

variable "execution_role" {
  type = string
  default = "arn:aws:iam::362524971603:role/ap_lambda_role"
}

variable "token_url" {
    type = string
    default = "https://test-next-web-api.nice.org.uk/administration/connect/token"
}

variable "client_id" {
    type = string
    default = "admin"
}

variable "client_secret" {
    type = string
    default = "066f86f158ff"
}

variable "scope" {
    type = string
    default = "admin"
}

variable "cache_clear_url" {
    type = string
    default = "https://test-next-web-api.nice.org.uk/administration/outputcache/OcelotStoryblok"
}