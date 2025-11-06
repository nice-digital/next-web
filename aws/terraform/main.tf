################################################################################
# AWS Naming convetion
# org-application-env-component
# eg....org = nice, application = nextweb, env = alpha, component = ecs
# nice-nextweb-alpha-ecs-hosting
################################################################################

terraform {
  required_version = ">= 0.14"
  required_providers {
	aws = {
		source = "hashicorp/aws"
		version = "~>6.0.0"
	}
  }
  //* Teamcity/Octopus Deploy Backend config *//
}

##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  region = "eu-west-1"

  # Make it faster by skipping something
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_credentials_validation = true
  skip_requesting_account_id  = false
}

##################################################################################
# Locals
##################################################################################

locals {
  default_tags = {
    org_name         = var.org_name
    application_name = var.application_name
    environment_name = var.environment_name
  }
  name = "${var.org_name}-${var.application_name}-${var.environment_name}"
}

##################################################################################
# Resources
##################################################################################

resource "aws_ecs_cluster" "nextweb-cluster" {
  name = "${local.name}-cluster"
}

resource "aws_ecs_task_definition" "nextweb-main-task" {
  family                   = "${local.name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.resource_cpu
  memory                   = var.resource_mem
  task_role_arn            = var.ecs_task_role
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "nextweb-container",
      image     = "${var.docker_image_address}${var.docker_image_build_number}",
      cpu       = var.resource_cpu,
      memory    = var.resource_mem,
      essential = true,
      environment = [
        {
          name  = "NODE_ENV"
          value = var.node_env
        }
      ]
	  entryPoint = ["npm", "run", "host", "--"],
	  command = ["-H", "${var.nextweb_hostname}", "-p", "3000"],
      mountPoints = [
        {
          sourceVolume  = "config",
          containerPath = "/next-web/config"
          readOnly      = false
        }
      ],
      portMappings = [
        {
          containerPort = 3000,
          hostPort      = 3000,
          protocol      = "tcp"
        }
      ],
      healthCheck = {
        retries = 10
        command = ["CMD-SHELL", "curl -f http://localhost:3000/status || exit 1"]
        timeout : 5
        interval : 10
        startPeriod : 30
      }
    }
  ])

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  volume {
    name = "config"

    efs_volume_configuration {
      file_system_id     = var.nextweb_efs_config_volume
      root_directory     = "/${var.nextweb_efs_config_volume_dir}/"
      transit_encryption = "ENABLED"
    }
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${local.name}-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ecs-tasks.amazonaws.com",
        },
        Effect = "Allow",
        Sid    = "",
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "nextweb-ecs-service" {
  name                   = "${local.name}-service"
  cluster                = aws_ecs_cluster.nextweb-cluster.id
  task_definition        = aws_ecs_task_definition.nextweb-main-task.arn
  desired_count          = var.server_count
  launch_type            = "FARGATE"
  enable_execute_command = true

  network_configuration {
    subnets          = var.nextweb_ecs_subnets
    security_groups  = var.nextweb_ecs_sg
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.load_balancer_tg
    container_name   = "nextweb-container"
    container_port   = 3000
  }
}
