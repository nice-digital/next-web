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

### .Net Core Locally stored secrets

Secrets and sensitive information can be stored locally in a file outside of a projects source control using the built in Secrets feature of .Net Core. More information can be found [https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=windows&view=aspnetcore-3.1] (https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?tabs=windows&view=aspnetcore-3.1)

Individual values/objects can be stored in a file located in the dev users' profile (on Windows) or in home directory on Linux. This file can be easily managed using "Manage user secrets" feature in Visual Studio. This can be found by in the menu which is displayed by right clicking on the project in solution explorer. This will open up secrets.json. Initially it is best to obtain this file from another dev.

In the production environment (dev, test, alpha, beta, live) the config is read from ocelot.production.json. This file has the secrets stored as Octopus variables which are replaced as part of the deployment process. 
