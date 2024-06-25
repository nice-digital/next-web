data "aws_api_gateway_rest_api" "ocelot_cache_clear_rest_api" {
  name = var.api_name
}

data "aws_iam_role" "ocelot_cache_clear_role" {
  name = var.ocelot_cache_clear_role
}

module "lambda_function" {
  source = "../aws-lambda-function"

  environment     = var.environment
  build           = var.build
  execution_role  = data.aws_iam_role.ocelot_cache_clear_role.arn
  token_url       = var.token_url
  client_id       = var.client_id
  client_secret   = var.client_secret
  scope           = var.scope
  cache_clear_url = var.cache_clear_url
}

resource "aws_api_gateway_deployment" "ocelot_cache_clear_deployment" {
  rest_api_id = data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      "${var.environment}-${var.build}"
    ]))
  }

  //lifecycle {
  //  create_before_destroy = true
  //}
}

resource "aws_api_gateway_stage" "ocelot_cache_clear_stage" {
  rest_api_id           = data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
  deployment_id         = aws_api_gateway_deployment.ocelot_cache_clear_deployment.id
  stage_name            = var.environment
  cache_cluster_enabled = false
  cache_cluster_size    = 0.5
  //depends_on            = [aws_cloudwatch_log_group.taxonomy_api_logs]
  variables = {
    TaxonomyGetAllSelectableTerms = "OcelotCacheClear-${var.environment}-${var.build}"
  }
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
  stage_name  = aws_api_gateway_stage.ocelot_cache_clear_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled        = true
    logging_level          = "INFO"
    throttling_burst_limit = 500
    throttling_rate_limit  = 1000
  }
}

resource "aws_api_gateway_method_settings" "ocelot_cache_clear_endpoint" {
  rest_api_id = data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
  stage_name  = aws_api_gateway_stage.ocelot_cache_clear_stage.stage_name
  method_path = "Test/GET"

  settings {
    cache_data_encrypted                       = false
    cache_ttl_in_seconds                       = 3600
    caching_enabled                            = false
    require_authorization_for_cache_control    = true
    unauthorized_cache_control_header_strategy = "SUCCEED_WITH_RESPONSE_HEADER"
    metrics_enabled                            = true
    logging_level                              = "INFO"
    throttling_burst_limit                     = 500
    throttling_rate_limit                      = 1000
  }
}

//resource "aws_api_gateway_api_key" "ocelot_cache_clear_key" {
//  name = "OcelotCacheClear-${var.environment}"
//}
//
//resource "aws_api_gateway_usage_plan" "ocelot_cache_clear_up" {
//  name = "OcelotCacheClear-${var.environment}-up"
//  api_stages {
//    api_id = data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
//    stage  = aws_api_gateway_stage.ocelot_cache_clear_stage.stage_name
//  }
//}
//
//resource "aws_api_gateway_usage_plan_key" "taxonomy_api_upk" {
//  key_id        = aws_api_gateway_api_key.ocelot_cache_clear_key.id
//  usage_plan_id = aws_api_gateway_usage_plan.ocelot_cache_clear_up.id
//  key_type      = "API_KEY"
//}