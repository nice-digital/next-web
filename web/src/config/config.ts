//import config from "config";
// import getConfig from "next/config";

import type { InitialiseOptions as SearchClientInitOptions } from "@nice-digital/search-client";

// const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export interface SearchConfig {
	/** The base URL of the Single Search Endpoint (SSE) e.g. https://beta-search-api.nice.org.uk/api/ */
	readonly baseURL: SearchClientInitOptions["baseURL"] | undefined;
}

export interface CacheControlConfig {
	/** The default value for the cache-control header */
	readonly defaultCacheHeader: string | undefined;
}

export interface JotFormPublicConfig {
	/** The full base URL for NICE's JotForm instance, including protocol but excluding trailing slash */
	readonly baseURL: string | undefined;
}

/**
 * Public run time config, available to both client and server
 */
export interface PublicConfig {
	/** The version number of the current build (or Octopus.Release.Number in Octo) */
	readonly buildNumber: string | undefined;

	/** Name of the environment e.g. _dev_ or _test_ */
	readonly environment: string | undefined;

	/** Name of the auth environment which is passed through to global nav */
	readonly authEnvironment: "live" | "beta" | "test" | "local";

	/** Disallow crawlers from indexing the site */
	readonly denyRobots: boolean;

	/** The base URL of the website including protocol and port e.g. http://localhost:3000 for local dev or http://dev.nice.org.uk.
	 *
	 * **Note** the lack of trailing slash! It will get prepended to paths that start with a slash. */
	readonly baseURL: string | undefined;

	/**
	 * The absolute URL to the NICE cookie banner script include
	 */
	readonly cookieBannerScriptURL: string | undefined;

	/**
	 * The base URL to the deployed NextJS _public_ folder, see https://nextjs.org/docs/basic-features/static-file-serving.
	 * Empty string means relative to the deployed app. Set it to an absolute path in _config.yml_ to use a CDN.
	 */
	readonly publicBaseURL: string | undefined;

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
	readonly keyPrefix: string | undefined;

	/** Path to the folder used for file system disk cache */
	readonly filePath: string | undefined;

	/** The default TTL (time to live), in seconds, of cache entries */
	readonly defaultTTL: number | undefined;

	/** The longer TTL (time to live), in seconds, for long-lived cache entries that rarely change */
	readonly longTTL: number | undefined;

	/** Threshold for TTL, in seconds, below which object caches are refreshed in the background as per https://edibleco.de/3hyfpGG */
	readonly refreshThreshold: number | undefined;
}

export interface FeedConfig {
	/** The origin URL of the feeds */
	readonly origin: string | undefined;

	/** The API key for accessing the feed */
	readonly apiKey: string | undefined;
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
	readonly accessToken: string | undefined;
	readonly ocelotEndpoint: string | undefined;
	readonly enableRootCatchAll: string | undefined;
}

/**
 * Server-only run time config, useful for secrets etc
 */
export interface ServerConfig {
	cache: CacheConfig;
	feeds: FeedsConfig;
}

const publicRuntimeConfig: PublicConfig = {
	storyblok: {
		accessToken: process.env.PUBLIC_STORYBLOK_ACCESS_TOKEN,
		enableRootCatchAll: process.env.PUBLIC_STORYBLOK_ENABLE_ROOT_CATCH_ALL,
		ocelotEndpoint: process.env.PUBLIC_STORYBLOK_OCELOT_ENDPOINT,
	},
	search: {
		baseURL: process.env.NEXT_PUBLIC_SEARCH_BASE_URL as `https://${string}/api`,
	},
	jotForm: {
		baseURL: process.env.PUBLIC_JOTFORM_BASE_URL,
	},
	authEnvironment: process.env.PUBLIC_AUTH_ENVIRONMENT as
		| "test"
		| "live"
		| "beta"
		| "local",
	publicBaseURL: process.env.PUBLIC_PUBLIC_BASE_URL,
	environment: process.env.PUBLIC_ENVIRONMENT,
	buildNumber: process.env.PUBLIC_BUILD_NUMBER,
	cookieBannerScriptURL: process.env.PUBLIC_COOKIE_BANNER_SCRIPT_URL,
	baseURL: process.env.PUBLIC_BASE_URL,
	denyRobots: process.env.PUBLIC_DENY_ROBOTS === "true",
	cacheControl: {
		defaultCacheHeader: process.env.PUBLIC_CACHE_CONTROL_DEFAULT_CACHE_HEADER,
	},
};

const serverRuntimeConfig: ServerConfig = {
	cache: {
		keyPrefix: process.env.SERVER_CACHE_KEY_PREFIX,
		defaultTTL: Number(process.env.SERVER_CACHE_DEFAULT_TTL),
		longTTL: Number(process.env.SERVER_CACHE_LONG_TTL),
		filePath: process.env.SERVER_CACHE_FILE_PATH,
		refreshThreshold: Number(process.env.SERVER_CACHE_REFRESH_THRESHOLD),
	},
	feeds: {
		publications: {
			origin: process.env.SERVER_FEEDS_PUBLICATIONS_ORIGIN,
			apiKey: process.env.SERVER_FEEDS_PUBLICATIONS_API_KEY,
		},
		inDev: {
			origin: process.env.SERVER_FEEDS_INDEV_ORIGIN,
			apiKey: process.env.SERVER_FEEDS_INDEV_API_KEY,
		},
		jotForm: {
			apiKey: process.env.SERVER_FEEDS_JOTFORM_API_KEY,
		},
	},
};

export { publicRuntimeConfig, serverRuntimeConfig };
