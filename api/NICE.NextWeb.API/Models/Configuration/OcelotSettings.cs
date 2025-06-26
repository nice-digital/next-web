namespace NICE.NextWeb.API.Models.Configuration
{
    public class OcelotSettings
    {
        public bool EnableEnhancedOcelotLogging { get; set; }
        public int RedisEndpointDatabase { get; set; }
        public string RedisConnectionString { get; set; }
        public string Environment { get; set; }
    }
}
