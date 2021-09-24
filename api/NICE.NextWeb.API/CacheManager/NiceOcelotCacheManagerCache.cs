using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CacheManager.Core;
using Microsoft.AspNetCore.Http;
using Ocelot.Cache;

namespace NICE.NextWeb.API.CacheManager
{
    public class NiceOcelotCacheManagerCache<T> : IOcelotCache<T>
    {
        private readonly ICacheManager<T> _cacheManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NiceOcelotCacheManagerCache(ICacheManager<T> cacheManager, IHttpContextAccessor httpContextAccessor)
        {
            _cacheManager = cacheManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public void Add(string key, T value, TimeSpan ttl, string region)
        {
            if (typeof(T).GetProperty("StatusCode") != null && typeof(T).GetProperty("StatusCode").GetValue(value).Equals(System.Net.HttpStatusCode.OK))
            {
                _cacheManager.Put(new CacheItem<T>(key, region, value, ExpirationMode.Absolute, ttl));
            }
        }

        public void AddAndDelete(string key, T value, TimeSpan ttl, string region)
        {
            var exists = _cacheManager.Get(key);

            if (exists != null)
            {
                _cacheManager.Remove(key);
            }

            Add(key, value, ttl, region);
        }

        public T Get(string key, string region)
        {
            if (_httpContextAccessor.HttpContext.Request.Headers["X-CacheManager-RefreshCache"].Count > 0)
            {
                return default(T);
            }

            var output = _cacheManager.Get<T>(key, region);
            return output;
        }

        public void ClearRegion(string region)
        {
            _cacheManager.ClearRegion(region);
        }
    }
}
