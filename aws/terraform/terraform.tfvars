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
