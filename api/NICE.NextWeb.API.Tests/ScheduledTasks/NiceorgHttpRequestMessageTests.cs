using Xunit;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;

namespace NICE.NextWeb.API.ScheduledTasks.RefreshGuidanceTaxonomyScheduledTask.Tests
{
    public class NiceorgHttpRequestMessageTests
    {
        [Fact()]
        public void GetNiceorgHttpRequestMessage_ReturnsNiceorgHttpRequestMessage_WithCorrectUrlAndKey()
        {
            //Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:NiceOrgBaseUrl", "http://niceorg.org.uk/" },
                { "CacheRefreshService:NiceOrgAPIKey", "xxxx-xxxx-xxxx-xxxx" },
            };

            IConfiguration mockConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            //Act
            var sut = new NiceorgHttpRequestMessage(mockConfiguration);

            //Assert
            Assert.Equal("http://niceorg.org.uk/api/endpoint?ApiKey=xxxx-xxxx-xxxx-xxxx",
                sut.GetNiceorgHttpRequestMessage("api/endpoint").RequestUri.ToString());
        }

        [Fact()]
        public void GetNiceorgHttpRequestMessage_ReturnsNiceorgHttpRequestMessage_WithCorrectRefreshHeader()
        {
            //Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:NiceOrgBaseUrl", "http://niceorg.org.uk/" },
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
