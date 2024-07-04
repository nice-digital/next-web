resource "aws_api_gateway_rest_api" "ocelot_cache_clear_rest_api" {
  body        = file("${path.module}/openapi.json")
  name        = var.api_name
  description = var.api_name
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

module "lambda_function" {
  source = "../aws-lambda-function"

	depends_on    = [aws_api_gateway_rest_api.ocelot_cache_clear_rest_api]

  environment     			= var.environment
  build           			= var.build
  token_url       			= var.token_url
  client_id       			= var.client_id
  client_secret   			= var.client_secret
  scope           			= var.scope
  cache_clear_url 			= var.cache_clear_url
}

resource "aws_api_gateway_deployment" "ocelot_cache_clear_deployment" {
  rest_api_id = aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id

	depends_on    = [
    aws_cloudwatch_log_group.ocelot_cache_clear_log_group, aws_api_gateway_rest_api.ocelot_cache_clear_rest_api
  ]

  triggers = {
    redeployment = sha1(jsonencode([
      "${var.environment}-${var.build}"
    ]))
  }
}

resource "aws_cloudwatch_log_group" "ocelot_cache_clear_log_group" {
  retention_in_days = 30
  skip_destroy      = true
  name_prefix       = "/aws/api_gw/${aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.name}/${var.environment}/"
}

resource "aws_api_gateway_stage" "ocelot_cache_clear_stage" {
  rest_api_id           = aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
  deployment_id         = aws_api_gateway_deployment.ocelot_cache_clear_deployment.id
  stage_name            = var.environment
  cache_cluster_enabled = false
  cache_cluster_size    = 0.5
	depends_on    = [aws_cloudwatch_log_group.ocelot_cache_clear_log_group]
  variables = {
    NextWebOcelotCacheClear = "NextWebOcelotCacheClear-${var.environment}-${var.build}"
  }
	access_log_settings {
    destination_arn = aws_cloudwatch_log_group.ocelot_cache_clear_log_group.arn
    format          = "$context.identity.sourceIp [$context.requestTime] \"$context.httpMethod $context.//resourcePath $context.protocol\" $context.status $context.responseLength $context.requestId"
  }
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
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
  rest_api_id = aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.id
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
