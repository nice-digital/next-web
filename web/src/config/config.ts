//import config from "config";
import getConfig from "next/config";

import type { InitialiseOptions as SearchClientInitOptions } from "@nice-digital/search-client";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export interface SearchConfig {
	/** The base URL of the Single Search Endpoint (SSE) e.g. https://beta-search-api.nice.org.uk/api/ */
	readonly baseURL: SearchClientInitOptions["baseURL"];
}

export interface CacheControlConfig {
	/** The default value for the cache-control header */
	readonly defaultCacheHeader: string;
}

export interface JotFormPublicConfig {
	/** The full base URL for NICE's JotForm instance, including protocol but excluding trailing slash */
	readonly baseURL: string;
}

/**
 * Public run time config, available to both client and server
 */
export interface PublicConfig {
	/** The version number of the current build (or Octopus.Release.Number in Octo) */
	readonly buildNumber: string;

	/** Name of the environment e.g. _dev_ or _test_ */
	readonly environment: string;

	/** The base URL of the website including protocol and port e.g. http://localhost:3000 for local dev or http://dev.nice.org.uk.
	 *
	 * **Note** the lack of trailing slash! It will get prepended to paths that start with a slash. */
	readonly baseURL: string;

	/**
	 * The absolute URL to the NICE cookie banner script include
	 */
	readonly cookieBannerScriptURL: string;

	/**
	 * The base URL to the deployed NextJS _public_ folder, see https://nextjs.org/docs/basic-features/static-file-serving.
	 * Empty string means relative to the deployed app. Set it to an absolute path in _config.yml_ to use a CDN.
	 */
	readonly publicBaseURL: string;

	readonly search: SearchConfig;

	/** Config for cache-control response headers */
	readonly cacheControl: CacheControlConfig;

	/** Public config for JotForm. Note, there's also a server config object with the secret API key */
	readonly jotForm: JotFormPublicConfig;

	/** Public config for Storyblok */
	readonly storyblok: StoryblokConfig;
}

/**
 * Config for object cache
 */
export interface CacheConfig {
	/** The prefix for cache keys */
	readonly keyPrefix: string;

	/** Path to the folder used for file system disk cache */
	readonly filePath: string;

	/** The default TTL (time to live), in seconds, of cache entries */
	readonly defaultTTL: number;

	/** The longer TTL (time to live), in seconds, for long-lived cache entries that rarely change */
	readonly longTTL: number;

	/** Threshold for TTL, in seconds, below which object caches are refreshed in the background as per https://edibleco.de/3hyfpGG */
	readonly refreshThreshold: number;
}

export interface FeedConfig {
	/** The origin URL of the feeds */
	readonly origin: string;

	/** The API key for accessing the feed */
	readonly apiKey: string;
}

export interface FeedsConfig {
	/** Feed config for publications */
	readonly publications: FeedConfig;

	/** Feed config for indev */
	readonly inDev: FeedConfig;

	/** Feed config for JotForm */
	readonly jotForm: Pick<FeedConfig, "apiKey">;
}

export interface StoryblokConfig {
	readonly accessToken: string;
	readonly ocelotEndpoint: string;
	readonly enableRootCatchAll: string;
}

/**
 * Server-only run time config, useful for secrets etc
 */
export interface ServerConfig {
	cache: CacheConfig;
	feeds: FeedsConfig;
	storyblok: StoryblokConfig;
}

export { publicRuntimeConfig, serverRuntimeConfig };
