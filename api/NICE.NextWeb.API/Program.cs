using CacheManager.Core;
using Microsoft.AspNetCore.Diagnostics;
using NICE.NextWeb.API;
using NICE.NextWeb.API.CacheManager;
using NICE.NextWeb.API.Infrastructure.Ocelot.Handlers;
using NICE.NextWeb.API.Models.Configuration;
using NICE.NextWeb.API.ScheduledTasks.Niceorg;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;
using System.Net;
using ConfigurationBuilder = Microsoft.Extensions.Configuration.ConfigurationBuilder;


var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.ToLower();

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile($"appsettings.{env}.json", optional: false)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

var loggingSettings = configuration.GetSection("Logging").Get<LoggingSettings>();


Log.Logger = SeriLogger.GetLoggerConfiguration(loggingSettings).CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    var ocelotSettings = builder.Configuration
        .GetSection("Ocelot")
        .Get<OcelotSettings>();

    builder.Configuration
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile($"ocelot.{env}.json");

    builder.Host.UseSerilog();

    builder.Services.Configure<OcelotSettings>(builder.Configuration.GetSection("Ocelot"));

    var ocelotBuilder = builder.Services
        .AddOcelot()
        .AddCacheManager(x => x
            .WithRedisConfiguration("redis", ocelotSettings.RedisConnectionString, ocelotSettings.RedisEndpointDatabase)
            .WithJsonSerializer()
            .WithRedisCacheHandle("redis"));

    builder.Services.AddControllersWithViews();

    if (ocelotSettings.EnableEnhancedOcelotLogging)
    {
        ocelotBuilder.AddDelegatingHandler<DownstreamLoggingHandler>(true);
    }

    builder.Services.AddSingleton<INiceorgHttpRequestMessage, NiceorgHttpRequestMessage>();

    builder.Services.AddScheduler((sender, args) =>
    {
        Console.Write(args.Exception.Message);
        args.SetObserved();
    });
    builder.Services.AddSingleton<IScheduledTask, RefreshGuidanceTaxonomyScheduledTask>();
    builder.Services.AddHttpClient<RefreshGuidanceTaxonomyScheduledTask>();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler(options =>
        {
            options.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "text/html";
                var exceptionObject = context.Features.Get<IExceptionHandlerFeature>();

                if (null != exceptionObject)
                {
                    Log.Error(exceptionObject.Error.Message, exceptionObject);
                    await context.Response.WriteAsync("An error has occurred").ConfigureAwait(false);
                }
            });
        });
    }

    app.UseStaticFiles();
    app.UseRouting();
    app.MapControllers();

    app.UseEndpoints(endpoints =>
    {
        endpoints
            .MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

        if ((ocelotSettings.Environment ?? "dev") != "live")
        {
            endpoints
                .MapControllerRoute(
                    name: "admin",
                    pattern: "{admin}/{controller}/{action=Index}/{id?}");
        }
    });

    if (ocelotSettings.EnableEnhancedOcelotLogging)
    {
        app.Use(async (context, next) =>
        {
            Log.Information("Extended Ocelot Logging - Upstream Request: {UpstreamUri} from {IP} | LogType: {LogType}",
                $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}",
                context.Connection.RemoteIpAddress?.ToString(), "UpstreamRequest");

            await next.Invoke();
        });
    }

    await app.UseOcelot();

    Log.Information("Application has started and logging is up and running");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
}
finally
{
    Log.CloseAndFlush();
}
