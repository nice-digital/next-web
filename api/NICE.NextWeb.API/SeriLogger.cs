
using NICE.Logging;
using NICE.Logging.Sinks.RabbitMQ;
using NICE.NextWeb.API.Models.Configuration;
using Serilog;

namespace NICE.NextWeb.API
{
    /// <summary>
    /// This has been refactored for .NET Core 6
    /// 
    /// It now just sets up a LoggerConfiguration object based off appsettings.json (and secrets.json on dev machines)
    /// </summary>
    public static class SeriLogger
    {
        public static LoggerConfiguration GetLoggerConfiguration(LoggingSettings loggingSettings)
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            var serilogFormatter = new NiceSerilogFormatter(loggingSettings.Environment, loggingSettings.Application);
            var serilogConfiguration = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .MinimumLevel.Is(loggingSettings.SerilogMinLevel);

            if (loggingSettings.UseRabbit && !string.IsNullOrEmpty(loggingSettings.RabbitMQHost))
            {
                var rabbitCfg = new RabbitMQConfiguration
                {
                    Hostname = loggingSettings.RabbitMQHost,
                    VHost = loggingSettings.RabbitMQVHost,
                    Port = loggingSettings.RabbitMQPort,
                    Username = loggingSettings.RabbitMQUsername ?? "",
                    Password = loggingSettings.RabbitMQPassword ?? "",
                    Protocol = RabbitMQ.Client.Protocols.AMQP_0_9_1,
                    Exchange = loggingSettings.RabbitMQExchangeName,
                    ExchangeType = loggingSettings.RabbitMQExchangeType
                };

                // Write logs to RabbitMQ / Kibana
                serilogConfiguration.WriteTo.RabbitMQ(rabbitCfg, serilogFormatter);
            }

            // Write logs to file
            if (loggingSettings.UseFile)
            {
                serilogConfiguration.WriteTo.File(serilogFormatter,
                    loggingSettings.SerilogFilePath,
                    fileSizeLimitBytes: 5000000,
                    retainedFileCountLimit: 5,
                    flushToDiskInterval: TimeSpan.FromSeconds(20));
            }
            return serilogConfiguration;
        }
    }
}
