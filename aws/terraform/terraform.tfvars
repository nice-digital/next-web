org_name = "nice"
environment_name = "#{environment_name}"
application_name = "#{application_name}"
docker_image_address = "#{docker_image_address}"
docker_image_build_number = "#{Octopus.Action[Extract Variables].Output.ExtractedBuildNumber}"
nextweb_efs_config_volume = "#{nextweb_efs_config_volume}"
nextweb_ecs_subnets = [#{nextweb_ecs_subnets}]
nextweb_ecs_sg = [#{nextweb_ecs_sg}]
