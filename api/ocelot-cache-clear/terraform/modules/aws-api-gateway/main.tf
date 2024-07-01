resource "aws_api_gateway_rest_api" "ocelot_cache_clear_rest_api" {
  body        = file("${path.module}/openapi.json")
  name        = var.api_name
  description = var.api_name
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
