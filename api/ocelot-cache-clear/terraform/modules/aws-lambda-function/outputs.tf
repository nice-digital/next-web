output "ocelot_cache_clear_qualified_arn" {
  value = aws_lambda_function.ocelot_cache_clear.qualified_arn
}

output "ocelot_cache_clear_function_name" {
  value = aws_lambda_function.ocelot_cache_clear.function_name
}

output "ocelot_cache_clear_version" {
  value = aws_lambda_function.ocelot_cache_clear.version
}