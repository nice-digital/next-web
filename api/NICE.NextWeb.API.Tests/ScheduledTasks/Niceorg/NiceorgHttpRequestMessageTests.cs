using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Xunit;

namespace NICE.NextWeb.API.Tests.ScheduledTasks.Niceorg
{
    public class NiceorgHttpRequestMessageTests
    {
        [Fact()]
        public void GetNiceorgHttpRequestMessage_ReturnsNiceorgHttpRequestMessage_WithCorrectUrlAndKey()
        {
            //Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:OcelotBaseUrl", "http://next-web-api.nice.org.uk/" },
                { "CacheRefreshService:NiceOrgAPIKey", "xxxx-xxxx-xxxx-xxxx" },
            };

            IConfiguration mockConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            //Act
            var sut = new NiceorgHttpRequestMessage(mockConfiguration);

            //Assert
            Assert.Equal("http://next-web-api.nice.org.uk/api/endpoint?ApiKey=xxxx-xxxx-xxxx-xxxx",
                sut.GetNiceorgHttpRequestMessage("api/endpoint").RequestUri.ToString());
        }

        [Fact()]
        public void GetNiceorgHttpRequestMessage_ReturnsNiceorgHttpRequestMessage_WithCorrectRefreshHeader()
        {
            //Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:OcelotBaseUrl", "http://next-web-api.nice.org.uk/" },
                { "CacheRefreshService:NiceOrgAPIKey", "xxxx-xxxx-xxxx-xxxx" },
            };

            IConfiguration mockConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            //Act
            var sut = new NiceorgHttpRequestMessage(mockConfiguration);

            //Assert
            Assert.True(
                sut.GetNiceorgHttpRequestMessage("api/endpoint").Headers.Contains("X-CacheManager-RefreshCache"));
        }
    }
}
