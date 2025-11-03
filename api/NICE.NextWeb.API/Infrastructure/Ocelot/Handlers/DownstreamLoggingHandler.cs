using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading.Tasks;
using System.Threading;
using Serilog;

namespace NICE.NextWeb.API.Infrastructure.Ocelot.Handlers;

public class DownstreamLoggingHandler : DelegatingHandler
{
    private readonly ILogger<DownstreamLoggingHandler> _logger;

    public DownstreamLoggingHandler(ILogger<DownstreamLoggingHandler> logger)
    {
        _logger = logger;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Extended Ocelot Logging - Sending downstream request: {DownstreamUri} | LogType: {LogType}", request.RequestUri, "DownstreamRequest");

        var response = await base.SendAsync(request, cancellationToken);

        _logger.LogInformation("Extended Ocelot Logging - Received downstream response: {StatusCode} from {DownstreamUri} | LogType: {LogType}", response.StatusCode, request.RequestUri, "DownstreamRequest");
        if (response.Content != null)
        {
            var responseBody = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("Extended Ocelot Logging - Downstream response body: {Body} from {DownstreamUri} | LogType: {LogType}", responseBody, request.RequestUri, "DownstreamRequestBody");
        }

        return response;
    }
}

