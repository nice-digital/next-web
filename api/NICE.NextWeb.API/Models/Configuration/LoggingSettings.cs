using Serilog.Events;

namespace NICE.NextWeb.API.Models.Configuration
{
    public class LoggingSettings
    {
        public string Application { get; set; }
        public string Environment { get; set; }
        public string RabbitMQHost { get; set; }
        public string RabbitMQVHost { get; set; }
        public int RabbitMQPort { get; set; }
        public string RabbitMQUsername { get; set; }
        public string RabbitMQPassword { get; set; }
        public string RabbitMQExchangeName { get; set; }
        public string RabbitMQExchangeType { get; set; }
        public string SerilogFilePath { get; set; }
        public string LogFilePath { get; set; }
        public LogEventLevel SerilogMinLevel { get; set; }
        public bool UseRabbit { get; set; }
        public bool UseFile { get; set; }
    }
}
