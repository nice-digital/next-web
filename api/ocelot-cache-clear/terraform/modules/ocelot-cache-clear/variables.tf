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
  type    = string
  default = "NextWebOcelotCacheClear"
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
