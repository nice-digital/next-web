using System;
using System.Net;
using CacheManager.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NICE.NextWeb.API.CacheManager;
using NICE.NextWeb.API.Infrastructure.Ocelot.Handlers;
using NICE.NextWeb.API.ScheduledTasks.Niceorg;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Serilog;

namespace NICE.NextWeb.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var isRequestLoggingEnabled = Configuration.GetValue<bool>("Ocelot:EnableEnhancedOcelotLogging");
            var redisDatabaseId = Configuration.GetValue<int>("Ocelot:RedisEndpointDatabase");
            var redisConnectionString = Configuration.GetValue<string>("Ocelot:RedisConnectionString");

            services.AddControllersWithViews();

            var ocelotBuilder = services.AddOcelot()
                .AddCacheManager(x =>
                    x.WithRedisConfiguration("redis", redisConnectionString, redisDatabaseId)
                        .WithJsonSerializer()
                        .WithRedisCacheHandle("redis"));

            if (isRequestLoggingEnabled)
            {
                ocelotBuilder.AddDelegatingHandler<DownstreamLoggingHandler>(true);
            }

            services.AddSingleton<INiceorgHttpRequestMessage, NiceorgHttpRequestMessage>();

            services.AddScheduler((sender, args) =>
            {
                Console.Write(args.Exception.Message);
                args.SetObserved();
            });
            services.AddSingleton<IScheduledTask, RefreshGuidanceTaxonomyScheduledTask>();
            services.AddHttpClient<RefreshGuidanceTaxonomyScheduledTask>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var ocelotEvniroment = Configuration.GetValue<string>("Ocelot:Environment");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(
                    options =>
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

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints
                    .MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");

                if (ocelotEvniroment != "live")
                {
                    endpoints
                        .MapControllerRoute(
                            name: "admin",
                            pattern: "{admin}/{controller}/{action=Index}/{id?}");
                }
            });

            var requestLoggingEnabled = Configuration.GetValue<bool>("Ocelot:EnableEnhancedOcelotLogging");

            if (requestLoggingEnabled)
            {
                app.Use(async (context, next) =>
                {
                    Log.Information("Extended Ocelot Logging - Upstream Request: {UpstreamUri} from {IP} | LogType: {LogType}",
                        $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}",
                        context.Connection.RemoteIpAddress?.ToString(), "UpstreamRequest");

                    await next.Invoke();
                });

            }

            app.UseOcelot().Wait();
        }
    }
}
