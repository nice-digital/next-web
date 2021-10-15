using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Ocelot.Middleware;
using Serilog;

namespace NICE.NextWeb.API.ScheduledTasks
{
    public class RefreshGuidanceTaxonomyScheduledTask : IScheduledTask
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public RefreshGuidanceTaxonomyScheduledTask(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }
        public string Schedule => "* * * * *";
        public string RefreshUrl => "api/TaxonomyMappings";
        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            var baseUrl = _configuration.GetValue<string>("CacheRefreshService:NiceOrgBaseUrl");
            var apiKey = _configuration.GetValue<string>("CacheRefreshService:NiceOrgAPIKey");
            var httpClient = _httpClientFactory.CreateClient();
            var requestUrl = $"{baseUrl}{RefreshUrl}?ApiKey={apiKey}";
            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            request.Headers.Add("X-CacheManager-RefreshCache", "");

            var response = await httpClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                Log.Information($"Successfully refreshed url:- {RefreshUrl}");
            }
            else
            {
                Log.Error($"Error when refreshing url:- {RefreshUrl}");
            }
        }
    }
}
