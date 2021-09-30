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
            services.AddControllersWithViews();

            var redisDatabaseId = Configuration.GetValue<int>("Ocelot:RedisEndpointDatabase");
            var redisConnectionString = Configuration.GetValue<string>("Ocelot:RedisConnectionString");

            services.AddOcelot()
                .AddCacheManager(x =>
                    x.WithRedisConfiguration("redis", redisConnectionString, redisDatabaseId)
                        .WithJsonSerializer()
                        .WithRedisCacheHandle("redis"));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
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
