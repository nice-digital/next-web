################################################################################
# AWS Naming convetion
# org-application-env-component
# eg....org = nice, application = nextweb, env = alpha, component = ecs
# nice-nextweb-alpha-ecs-hosting
################################################################################

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

terraform {
  required_version = ">= 0.14"
  required_providers {
  }
  backend "s3" {
    bucket = "tfs3test"
    key    = "nextweb/terraform.tfstate"
    region = "eu-west-1"
  }
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

  # skip_requesting_account_id should be disabled to generate valid ARN in apigatewayv2_api_execution_arn
  skip_requesting_account_id = false
}

##################################################################################
# Locals
##################################################################################

locals {
	default_tags = {
		org_name = var.org_name
		application_name = var.application_name
		environment_name = var.environment_name
}
	name = "${var.org_name}-${var.application_name}-${var.environment_name}"
}

##################################################################################
# MODULES
##################################################################################

resource "aws_ecs_cluster" "nextweb-cluster" {
  name = "${local.name}-cluster"
}

resource "aws_ecs_task_definition" "nextweb-main-task" {
  family                   = "${local.name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "nextweb-container",
      image     = "${var.docker_image_address}${var.docker_image_build_number}",
      cpu       = 256,
      memory    = 512,
      essential = true,
      environment = [
        {
          name  = "NODE_ENV"
          value = var.node_env
        }
      ]
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
      ]
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
      root_directory     = "/${var.docker_image_build_number}/" # Adjust if your EFS has a specific root directory
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
  name            = "${local.name}-service"
  cluster         = aws_ecs_cluster.nextweb-cluster.id
  task_definition = aws_ecs_task_definition.nextweb-main-task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets = var.nextweb_ecs_subnets
    security_groups = var.nextweb_ecs_sg
    assign_public_ip = false
  }

    load_balancer {
    target_group_arn = var.load_balancer_tg
    container_name   = "nextweb-container"
    container_port   = 3000
  }
}
