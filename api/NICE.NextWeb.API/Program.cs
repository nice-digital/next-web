using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using Serilog;

namespace NICE.NextWeb.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = SeriLogger.GetLoggerConfiguration().CreateLogger();
            try
            {
                CreateHostBuilder(args).Build().Run();
                Log.Information("Application has started and logging up and running");
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Application start-up failed");
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.ToLower();
                    webBuilder.UseStartup<Startup>();
                    if (env != "Development")
                    {
                        webBuilder.ConfigureAppConfiguration(config => config
                            .AddJsonFile($"ocelot.{env}.json"));
                    }
                })
                .UseSerilog();
    }
}
