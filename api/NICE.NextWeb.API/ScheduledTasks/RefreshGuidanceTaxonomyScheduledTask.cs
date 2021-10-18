using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Policy;
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
        private readonly INiceorgHttpRequestMessage _httpRequestMessage;

        public RefreshGuidanceTaxonomyScheduledTask(IHttpClientFactory httpClientFactory,
            INiceorgHttpRequestMessage httpRequestMessage)
        {
            _httpClientFactory = httpClientFactory;
            _httpRequestMessage = httpRequestMessage;
        }

        public string Schedule => "* * * * *";
        public string RefreshUrl => "api/TaxonomyMappings";

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            var httpClient = _httpClientFactory.CreateClient();

            try
            {
                var response = await httpClient.SendAsync(_httpRequestMessage.GetNiceorgHttpRequestMessage(RefreshUrl),
                    cancellationToken);
                response.EnsureSuccessStatusCode();

                Log.Information($"Successfully refreshed url:- {RefreshUrl}");
            }
            catch (Exception e)
            {
                Log.Error(e, $"Error when refreshing url:- {RefreshUrl}");
                throw;
            }
        }
    }
}
