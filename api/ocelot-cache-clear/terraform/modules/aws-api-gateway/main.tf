resource "aws_api_gateway_rest_api" "ocelot_cache_clear_rest_api" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "OcelotCacheClear"
      version = "1.0"
    }
    paths = {
      "/OcelotCacheClear" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "GET"
            type                 = "aws_proxy"
            uri                  = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:362524971603:function:OcelotCacheClear-test-1/invocations",
            responses: {
            default: {
              statusCode: 200
            }
          },
          passthroughBehavior: "when_no_match",
          contentHandling: "CONVERT_TO_TEXT"
          },
          responses: {
            200: {
              description: "topic browse mappings response"
            }
          }
        }
      }
    }
  })
  name        = var.api_name
  description = var.api_name
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}