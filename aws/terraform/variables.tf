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
variable "nextweb_efs_config_volume_dir" {
  type = string
}
variable "nextweb_ecs_subnets" {
  type = list(string)
}
variable "nextweb_ecs_sg" {
  type = list(string)
}
variable "load_balancer_tg" {
  type = string
}
variable "node_env" {
  type = string
}
variable "resource_cpu" {
  type = number
}
variable "resource_mem" {
  type = number
}
variable "ecs_task_role" {
  type = string
}
variable "server_count" {
  type = number
}
variable "next_public_auth_environment" {
  type = string
}
variable "next_public_base_url" {
  type = string
}
variable "next_public_build_number" {
  type = string
}
variable "next_public_environment" {
  type = string
}
variable "next_public_public_base_url" {
  type = string
}
variable "next_public_search_base_url" {
  type = string
}
variable "next_public_storyblok_access_token" {
  type = string
}
variable "next_public_storyblok_enable_root_catch_all" {
  type = string
}
variable "next_public_storyblok_ocelot_endpoint" {
  type = string
}
variable "public_cookie_banner_script_url" {
  type = string
}
variable "public_deny_robots" {
  type = string
}
variable "server_cache_file_path" {
  type = string
}
variable "server_cache_key_prefix" {
  type = string
}
variable "server_cache_long_ttl" {
  type = string
}
variable "server_feeds_indev_api_key" {
  type = string
}
variable "server_feeds_indev_origin" {
  type = string
}
variable "server_feeds_jotform_api_key" {
  type = string
}
variable "server_feeds_publications_api_key" {
  type = string
}
variable "server_feeds_publications_origin" {
  type = string
}
