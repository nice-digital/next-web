using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CacheManager.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Ocelot.Cache;
using Ocelot.Configuration;
using Ocelot.Configuration.File;
using Ocelot.DependencyInjection;

namespace NICE.NextWeb.API.CacheManager
{
    public static class OcelotBuilderExtensions
    {
        public static IOcelotBuilder AddCacheManager(this IOcelotBuilder builder,
            Action<ConfigurationBuilderCachePart> settings)
        {
            var cacheManagerOutputCache = CacheFactory.Build<CachedResponse>("OcelotOutputCache", settings);
            var ocelotOutputCacheManager =
                new NiceOcelotCacheManagerCache<CachedResponse>(cacheManagerOutputCache, new HttpContextAccessor());

            builder.Services.RemoveAll(typeof(ICacheManager<CachedResponse>));
            builder.Services.RemoveAll(typeof(IOcelotCache<CachedResponse>));
            builder.Services.AddSingleton<ICacheManager<CachedResponse>>(cacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<CachedResponse>>(ocelotOutputCacheManager);

            var ocelotConfigCacheManagerOutputCache =
                CacheFactory.Build<IInternalConfiguration>("OcelotConfigurationCache", settings);
            var ocelotConfigCacheManager =
                new NiceOcelotCacheManagerCache<IInternalConfiguration>(ocelotConfigCacheManagerOutputCache,
                    new HttpContextAccessor());
            builder.Services.RemoveAll(typeof(ICacheManager<IInternalConfiguration>));
            builder.Services.RemoveAll(typeof(IOcelotCache<IInternalConfiguration>));
            builder.Services.AddSingleton<ICacheManager<IInternalConfiguration>>(ocelotConfigCacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<IInternalConfiguration>>(ocelotConfigCacheManager);

            var fileConfigCacheManagerOutputCache =
                CacheFactory.Build<FileConfiguration>("FileConfigurationCache", settings);
            var fileConfigCacheManager =
                new NiceOcelotCacheManagerCache<FileConfiguration>(fileConfigCacheManagerOutputCache,
                    new HttpContextAccessor());
            builder.Services.RemoveAll(typeof(ICacheManager<FileConfiguration>));
            builder.Services.RemoveAll(typeof(IOcelotCache<FileConfiguration>));
            builder.Services.AddSingleton<ICacheManager<FileConfiguration>>(fileConfigCacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<FileConfiguration>>(fileConfigCacheManager);
            return builder;
        }
    }
}
