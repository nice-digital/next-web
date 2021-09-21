using CacheManager.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NICE.NextWeb.API.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

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
            services.AddOcelot()
                .AddCacheManager(x =>
                    x.WithRedisConfiguration("redis", config =>
                        config.WithAllowAdmin()
                            .WithDatabase(Configuration.GetValue<int>("Ocelot:RedisEndpointDatabase"))
                            .WithEndpoint(Configuration.GetValue<string>("Ocelot:RedisEndpoint"), Configuration.GetValue<int>("Ocelot:RedisEndpointPort")))
                        .WithJsonSerializer()
                        .WithRedisCacheHandle("redis"));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context => { await context.Response.WriteAsync("Ocelot"); });
            });

            app.UseOcelot().Wait();
        }
    }
}
