org_name = "nice"
environment_name = "#{terraform_environment_name}"
application_name = "#{terraform_application_name}"
docker_image_address = "#{terraform_docker_image_address}"
docker_image_build_number = "#{Octopus.Action[Extract Variables].Output.ExtractedBuildNumber}"
nextweb_efs_config_volume = "#{terraform_nextweb_efs_config_volume}"
nextweb_efs_config_volume_dir = "#{Octopus.Action[Extract Variables].Output.NextwebEfsConfigVolumeDir}"
nextweb_ecs_subnets = [#{terraform_nextweb_ecs_subnets}]
nextweb_ecs_sg = [#{terraform_nextweb_ecs_sg}]
load_balancer_tg = "#{terraform_load_balancer_tg}"
node_env = "#{terraform_node_env}"
resource_cpu = "#{terraform_resource_cpu}"
resource_mem = "#{terraform_resource_mem}"
ecs_task_role = "#{terraform_task_role}"
server_count = "#{terraform_server_count}"
next_public_john = "#{NEXT_PUBLIC_JOHN}"
public_john = "#{PUBLIC_JOHN}"
public_new_john = "#{PUBLIC_NEW_JOHN}"
next_public_auth_environment = "#{NEXT_PUBLIC_AUTH_ENVIRONMENT}"
next_public_base_url = "#{NEXT_PUBLIC_BASE_URL}"
next_public_build_number = "#{NEXT_PUBLIC_BUILD_NUMBER}"
next_public_environment = "#{NEXT_PUBLIC_ENVIRONMENT}"
next_public_public_base_url = "#{NEXT_PUBLIC_PUBLIC_BASE_URL}"
next_public_search_base_url = "#{NEXT_PUBLIC_SEARCH_BASE_URL}"
next_public_storyblok_access_token = "#{NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN}"
next_public_storyblok_enable_root_catch_all = "#{NEXT_PUBLIC_STORYBLOK_ENABLE_ROOT_CATCH_ALL}"
next_public_storyblok_ocelot_endpoint = "#{NEXT_PUBLIC_STORYBLOK_OCELOT_ENDPOINT}"
public_cookie_banner_script_url = "#{PUBLIC_COOKIE_BANNER_SCRIPT_URL}"
public_deny_robots = "#{PUBLIC_DENY_ROBOTS}"
server_cache_file_path = "#{SERVER_CACHE_FILE_PATH}"
server_cache_key_prefix = "#{SERVER_CACHE_KEY_PREFIX}"
server_cache_long_ttl = "#{SERVER_CACHE_LONG_TTL}"
server_feeds_indev_api_key = "#{SERVER_FEEDS_INDEV_API_KEY}"
server_feeds_indev_origin = "#{SERVER_FEEDS_INDEV_ORIGIN}"
server_feeds_jotform_api_key = "#{SERVER_FEEDS_JOTFORM_API_KEY}"
server_feeds_publications_api_key = "#{SERVER_FEEDS_PUBLICATIONS_API_KEY}"
server_feeds_publications_origin = "#{SERVER_FEEDS_PUBLICATIONS_ORIGIN}"
