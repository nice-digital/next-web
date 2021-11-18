using System;
using CacheManager.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Ocelot.Cache;
using Ocelot.Configuration;
using Ocelot.Configuration.File;
using Ocelot.DependencyInjection;

namespace NICE.NextWeb.API.CacheManager
{
    public static class NiceOcelotBuilderExtensions
    {
        public static IOcelotBuilder AddCacheManager(this IOcelotBuilder builder,
            Action<ConfigurationBuilderCachePart> settings)
        {
            var cacheManagerOutputCache = CacheFactory.Build<CachedResponse>("OcelotOutputCache", settings);

            builder.Services.RemoveAll(typeof(ICacheManager<CachedResponse>));
            builder.Services.RemoveAll(typeof(IOcelotCache<CachedResponse>));
            builder.Services.AddSingleton(cacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<CachedResponse>, NiceOcelotCacheManagerCache<CachedResponse>>();

            var ocelotConfigCacheManagerOutputCache =
                CacheFactory.Build<IInternalConfiguration>("OcelotConfigurationCache", settings);
            builder.Services.RemoveAll(typeof(ICacheManager<IInternalConfiguration>));
            builder.Services.RemoveAll(typeof(IOcelotCache<IInternalConfiguration>));
            builder.Services.AddSingleton(ocelotConfigCacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<IInternalConfiguration>, NiceOcelotCacheManagerCache<IInternalConfiguration>>();

            var fileConfigCacheManagerOutputCache =
                CacheFactory.Build<FileConfiguration>("FileConfigurationCache", settings);
            builder.Services.RemoveAll(typeof(ICacheManager<FileConfiguration>));
            builder.Services.RemoveAll(typeof(IOcelotCache<FileConfiguration>));
            builder.Services.AddSingleton(fileConfigCacheManagerOutputCache);
            builder.Services.AddSingleton<IOcelotCache<FileConfiguration>, NiceOcelotCacheManagerCache<FileConfiguration>>();

            return builder;
        }
    }
}
