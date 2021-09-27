# Ocelot API Layer

> Ocelot API Layer for Next Web

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Ocelot API Layer](#ocelot-api-layer)
	- [Stack](#stack)
		- [Software](#software)
	- [Local development setup](#local-development-setup)
		- [.Net Core Locally stored secrets](#net-core-locally-stored-secrets)
	- [Ocelot](#ocelot)
		- [X-CacheManager-RefreshCache Header](#x-cachemanager-refreshcache-header)
	- [Gotchas](#gotchas)
		- [Redis SSL Connection](#redis-ssl-connection)

<!-- END doctoc -->
</details>

## Stack

### Software

- [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1 LTS](https://dotnet.microsoft.com/)
- [xUnit](https://xunit.net/) for tests
- [Ocelot](https://ocelot.readthedocs.io/) API Framework
- [CacheManager](https://cachemanager.michaco.net/) Caching framework form Ocelot
- [Redis](https://redis.io/) Key/Value store for CacheManager
- [ElastiCache](https://aws.amazon.com/elasticache/) AWS Managed Redis service
- [Docker](https://redis.io/) To run Redis locally for dev purposes

## Local development setup
1. Clone next-web project to local machine
1. Open NICE.NextWeb.API project in Visual Studio 2019
1. Restore nuget packages
1. Restore locally stored secrets see [.Net Core Locally stored secrets](#.Net-Core-Locally-stored-secrets)
2. To run Redis locally start docker using the command `docker-compose up`

### .Net Core Locally stored secrets

Secrets and sensitive information can be stored locally in a file outside of a projects source control using the built in Secrets feature of .Net Core. More information can be found here [https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=windows&view=aspnetcore-3.1](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=windows&view=aspnetcore-3.1)

Individual values/objects can be stored in a file located in the dev users' profile (on Windows) or in home directory on Linux. This file can be easily managed using "Manage user secrets" feature in Visual Studio. This can be found by in the menu which is displayed by right clicking on the project in solution explorer. This will open up secrets.json. Initially it is best to obtain this file from another dev.

In the production environment (dev, test, alpha, beta, live) the config is read from ocelot.production.json. This file has the secrets stored as Octopus variables which are replaced as part of the deployment process. 

## Ocelot
Ocelot is used by this project to provide basic API Gateway functionality. More information can be found here [Ocelot](https://ocelot.readthedocs.io/). This project is using version Ocelot 16.0.1 which is the highest version that supports .Net Core 3.1 LTS.

Ocelot is loaded from Nuget packages with some minor customisations. Mainly a custom Cache Manager is injected into the service collection. This custom Cache Manager is default except it inspects headers for the X-CacheManager-RefreshCache header which is described [here](#x-cachemanager-refreshcache-header).

Additionally some convenience configuration extension functions are provided to configure Ocelot and CacheManager.
### X-CacheManager-RefreshCache Header
If X-CacheManager-RefreshCache header is present on an incoming request Ocelot will not attempt to load the content from cache first. It will load the content from the downstream host. This content will then stored in cache replacing existing content). This is useful as it will provide a method to warm the cache up and also maintain it in a warm/hot state.

If X-CacheManager-RefreshCache is not present on an incoming request the content is loaded from cache first and if not present in cache it will be loaded from the downstream host (and then stored in cache). Such a request would be a general request from an end user.

## Gotchas
### Redis SSL Connection

When running Redis locally TLS is not configured by default. However in AWS Elasticache it is turned on by default in versions higher than 6. To enable SSL connections use the change the RedisConnectionString entry in appsettings.json to  `SSL=True`
