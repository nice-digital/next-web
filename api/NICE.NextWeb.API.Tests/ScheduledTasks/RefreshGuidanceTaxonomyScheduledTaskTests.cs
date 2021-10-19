using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;
using NICE.NextWeb.API.ScheduledTasks;
using NICE.NextWeb.API.ScheduledTasks.Niceorg;
using NICE.NextWeb.API.ScheduledTasks.Scheduler;
using Xunit;

namespace NICE.NextWeb.API.Tests.ScheduledTasks
{
    public class RefreshGuidanceTaxonomyScheduledTaskTests
    {
        [Fact()]
        public async Task ExecuteAsyncTest_ReturnsTask_WithCompletedSuccessfullyStatus()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:NiceOrgBaseUrl", "http://niceorg.org.uk" },
                { "CacheRefreshService:NiceOrgAPIKey", "xxxx-xxxx-xxxx-xxxx" },
            };

            IConfiguration mockConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var mockHttpRequestMessage = new Mock<NiceorgHttpRequestMessage>(mockConfiguration);

            var mockFactory = new Mock<IHttpClientFactory>();

            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(""),
                });

            var client = new HttpClient(mockHttpMessageHandler.Object);
            mockFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(client);

            var sut = new RefreshGuidanceTaxonomyScheduledTask(mockFactory.Object, mockHttpRequestMessage.Object);

            //Act
            Task result = sut.ExecuteAsync(new CancellationToken());
            await result;

            //Assert
            Assert.True(result.IsCompletedSuccessfully);
        }

        [Fact()]
        public async Task ExecuteAsyncTest_BadRequest_ReturnsException()
        {
            // Arrange
            var inMemorySettings = new Dictionary<string, string>
            {
                { "CacheRefreshService:NiceOrgBaseUrl", "http://niceorg.org.uk" },
                { "CacheRefreshService:NiceOrgAPIKey", "xxxx-xxxx-xxxx-xxxx" },
            };

            IConfiguration mockConfiguration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var mockHttpRequestMessage = new Mock<NiceorgHttpRequestMessage>(mockConfiguration);

            var mockFactory = new Mock<IHttpClientFactory>();

            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent(""),
                });

            var client = new HttpClient(mockHttpMessageHandler.Object);
            mockFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(client);

            var sut = new RefreshGuidanceTaxonomyScheduledTask(mockFactory.Object, mockHttpRequestMessage.Object);

            //Act
            var caughtException =
                Assert.ThrowsAsync<HttpRequestException>(() => sut.ExecuteAsync(new CancellationToken()));

            //Assert
            Assert.Equal("Response status code does not indicate success: 400 (Bad Request).",
                caughtException.Result.Message);
        }
    }
}
