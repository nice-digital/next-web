using Xunit;
using System;
using CacheManager.Core;
using Microsoft.AspNetCore.Http;
using Moq;
using Ocelot.Cache;

namespace NICE.NextWeb.API.CacheManager.Tests
{
    public class NiceOcelotCacheManagerCacheTests
    {
        [Fact()]
        public void Add_ShouldPutResponseIntoCache()
        {
            //Arrange
            var mockCacheManger = new Mock<ICacheManager<CachedResponse>>();
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            var sut = new NiceOcelotCacheManagerCache<CachedResponse>(mockCacheManger.Object,
                mockHttpContextAccessor.Object);

            var cachedResponse = new CachedResponse(System.Net.HttpStatusCode.OK, null, "", null, null);

            //Act
            sut.Add("test", cachedResponse, TimeSpan.FromDays(1), "test");

            //Assert
            mockCacheManger.Verify(x => x.Put(It.IsAny<CacheItem<CachedResponse>>()), Times.Once());
        }

        [Fact()]
        public void Add_shouldNotPut500ResponseIntoCache()
        {
            //Arrange
            var mockCacheManger = new Mock<ICacheManager<CachedResponse>>();
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            var sut = new NiceOcelotCacheManagerCache<CachedResponse>(mockCacheManger.Object,
                mockHttpContextAccessor.Object);

            var cachedResponse =
                new CachedResponse(System.Net.HttpStatusCode.InternalServerError, null, "", null, null);

            //Act
            sut.Add("test", cachedResponse, TimeSpan.FromDays(1), "test");

            //Assert
            mockCacheManger.Verify(x => x.Put(It.IsAny<CacheItem<CachedResponse>>()), Times.Never());
        }
    }
}
