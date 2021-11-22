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

        public string Schedule => "1,16,31,46 * * * *"; //Cron schedule - “At minute 1, 16, 31, and 46.”
        public string RefreshUrl => "api/TaxonomyMappings/";

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var httpRequestMessage = _httpRequestMessage.GetNiceorgHttpRequestMessage(RefreshUrl);

            try
            {
                var response = await httpClient.SendAsync(httpRequestMessage,
                    cancellationToken);
                response.EnsureSuccessStatusCode();

                Log.Information($"Successfully refreshed url:- {httpRequestMessage.RequestUri}");
            }
            catch (Exception e)
            {
                Log.Error(e, $"Error when refreshing url:- {httpRequestMessage.RequestUri}");
                throw;
            }
        }
    }
}
