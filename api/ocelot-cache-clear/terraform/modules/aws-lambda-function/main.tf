data "aws_api_gateway_rest_api" "ocelot_cache_clear_rest_api" {
  name = "NextWebOcelotCacheClear"
}

data "aws_iam_role" "ocelot_cache_clear_role" {
  name = "NextWebOcelotCacheClear"
}

resource "aws_cloudwatch_log_group" "ocelot_cache_clear_log_group" {
  retention_in_days = 30
  skip_destroy      = true
  name_prefix       = "/aws/lambda/NextWebOcelotCacheClear-${var.environment}-${var.build}/"
}

resource "aws_lambda_function" "ocelot_cache_clear" {

  function_name = "NextWebOcelotCacheClear-${var.environment}-${var.build}"
  description   = "NextWebOcelotCacheClear-${var.environment}-${var.build}"

  role = data.aws_iam_role.ocelot_cache_clear_role.arn

  runtime = "nodejs20.x"
  handler = "index.handler"

  filename = "../../../index.zip"
  timeout  = 10

  environment {
    variables = {
      cache_clear_url = var.cache_clear_url
      client_id       = var.client_id
      client_secret   = var.client_secret
      scope           = var.scope
      token_url       = var.token_url
    }
  }

  logging_config {
    log_group             = aws_cloudwatch_log_group.ocelot_cache_clear_log_group.id
    log_format            = "JSON"
    system_log_level      = "WARN"
    application_log_level = "WARN"
  }
}

resource "aws_lambda_permission" "ocelot_cache_clear" {
  statement_id_prefix = "AllowLambdaExecutionFromNextWebOcelotCacheClear-"
  action              = "lambda:InvokeFunction"
  function_name       = aws_lambda_function.ocelot_cache_clear.arn
  principal  = "apigateway.amazonaws.com"
  source_arn = "${data.aws_api_gateway_rest_api.ocelot_cache_clear_rest_api.execution_arn}/*"
  depends_on = [aws_lambda_function.ocelot_cache_clear]
  lifecycle {
    replace_triggered_by = [
      aws_lambda_function.ocelot_cache_clear
    ]
  }
}

resource "aws_lambda_function_url" "ocelot_cache_clear" {
  count              = 1
  function_name      = aws_lambda_function.ocelot_cache_clear.function_name
  authorization_type = "NONE"
  depends_on         = [aws_lambda_function.ocelot_cache_clear]
}
