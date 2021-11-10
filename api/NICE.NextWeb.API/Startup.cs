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
            services.AddControllersWithViews();

            var redisDatabaseId = Configuration.GetValue<int>("Ocelot:RedisEndpointDatabase");
            var redisConnectionString = Configuration.GetValue<string>("Ocelot:RedisConnectionString");

            services.AddOcelot()
                .AddCacheManager(x =>
                    x.WithRedisConfiguration("redis", redisConnectionString, redisDatabaseId)
                        .WithJsonSerializer()
                        .WithRedisCacheHandle("redis"));

            services.AddSingleton<INiceorgHttpRequestMessage, NiceorgHttpRequestMessage>();
            services.AddSingleton<IScheduledTask, RefreshGuidanceTaxonomyScheduledTask>();
            services.AddScheduler((sender, args) =>
            {
                Console.Write(args.Exception.Message);
                args.SetObserved();
            });
            services.AddHttpClient<RefreshGuidanceTaxonomyScheduledTask>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
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
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseOcelot().Wait();
        }
    }
}
