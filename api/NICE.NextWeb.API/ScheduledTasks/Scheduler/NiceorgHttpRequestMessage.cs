using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace NICE.NextWeb.API.ScheduledTasks.Scheduler
{
    public interface INiceorgHttpRequestMessage
    {
        HttpRequestMessage GetNiceorgHttpRequestMessage(string refreshUrl);
    }

    public class NiceorgHttpRequestMessage : INiceorgHttpRequestMessage
    {
        private readonly IConfiguration _configuration;

        public NiceorgHttpRequestMessage(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public HttpRequestMessage GetNiceorgHttpRequestMessage(string refreshUrl)
        {
            var baseUrl = _configuration.GetValue<string>("CacheRefreshService:NiceOrgBaseUrl");
            var apiKey = _configuration.GetValue<string>("CacheRefreshService:NiceOrgAPIKey");

            var requestUrl = $"{baseUrl}{refreshUrl}?ApiKey={apiKey}";
            var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            httpRequestMessage.Headers.Add("X-CacheManager-RefreshCache", "");

            return httpRequestMessage;
        }
    }
}
