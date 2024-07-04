
variable "api_name" {
  type    = string
  default = "NextWebOcelotCacheClear"
}

variable "environment" {
  type = string
  default = "test"
}

variable "role_name" {
  type    = string
  default = "NextWebOcelotCacheClear"
}

variable "role_description" {
  type    = string
  default = "Ocelot Cache Clear access to AWS services"
}

variable "build" {
  type = string
  default = "1"
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
