using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Serilog;

namespace NICE.NextWeb.API.ScheduledTasks.Niceorg
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
