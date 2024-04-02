##################################################################################
# VARIABLES
##################################################################################
variable "org_name" {
    type = string
}
variable "environment_name" {
    type = string
}
variable "application_name" {
    type = string
}
variable "docker_image_address" {
    type = string
}
variable "docker_image_build_number" {
    type = string
}
variable "nextweb_efs_config_volume" {
    type = string
}
variable "nextweb_ecs_subnets" {
  type    = list(string)
}
variable "nextweb_ecs_sg" {
  type    = list(string)
}
variable "load_balancer_tg" {
  type    = string
}
variable "node_env" {
  type    = string
}
variable "resource_cpu" {
  type    = number
}
variable "resource_mem" {
  type    = number
}
variable "cloudwatchlog_policy" {
	type   = string
}
variable "ecs_task_role" {
	type   = string
}
