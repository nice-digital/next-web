//import config from "config";
import getConfig from "next/config";

import type { InitialiseOptions as SearchClientInitOptions } from "@nice-digital/search-client";

// Get public config from Next.js runtime config
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

// Server-side YAML config loader that mimics the config package behavior
function loadServerConfig(): ServerConfig {
	// Only run on server side, but allow test environment
	if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
		return getEmptyServerConfig();
	}

	// For test environment, return mock config
	const nodeEnv = process.env.NODE_ENV || "development";

	if (nodeEnv === "test") {
		const testConfig = {
			server: {
				cache: {
					keyPrefix: "next-web:tests",
					filePath: "./.cache-test/",
					defaultTTL: 300,
					longTTL: 86400,
					refreshThreshold: 150,
				},
				feeds: {
					publications: {
						origin: "http://publications.localhost:8080",
						apiKey: "TEST_API_KEY",
					},
					inDev: {
						origin: "http://indev.localhost:8080",
						apiKey: "TEST_API_KEY",
					},
					jotForm: {
						apiKey: "TEST_API_KEY",
					},
				},
			},
		};
		return testConfig.server;
	}

	try {
		// Use dynamic require to avoid webpack bundling issues
		const fs = eval("require")("fs");
		const yaml = eval("require")("js-yaml");
		const path = eval("require")("path");

		// Determine the config directory relative to the project root
		const configDir = path.join(process.cwd(), "config");

		// Start with default.yml
		const defaultConfigPath = path.join(configDir, "default.yml");
		let mergedConfig = {};

		if (fs.existsSync(defaultConfigPath)) {
			const defaultContent = fs.readFileSync(defaultConfigPath, "utf8");
			const defaultConfig = yaml.load(defaultContent);
			mergedConfig = { ...defaultConfig };
		}

		// Determine environment-specific config file
		let envConfigPath = "";

		// Use local-development.yml for development, local-production.yml for production
		if (nodeEnv === "development") {
			envConfigPath = path.join(configDir, "local-development.yml");
		} else if (nodeEnv === "production") {
			envConfigPath = path.join(configDir, "local-production.yml");
		}

		// Load and merge environment-specific config if it exists
		if (envConfigPath && fs.existsSync(envConfigPath)) {
			const envContent = fs.readFileSync(envConfigPath, "utf8");
			const envConfig = yaml.load(envContent);

			// Deep merge the configs (environment config overrides default)
			mergedConfig = deepMerge(mergedConfig, envConfig);
		}

		// Return only the server portion
		return (
			(mergedConfig as { server?: ServerConfig }).server ||
			getEmptyServerConfig()
		);
	} catch (error) {
		console.error("Could not load server config from YAML:", error);
		return getEmptyServerConfig();
	}
}

// Helper function to provide a default empty server config
function getEmptyServerConfig(): ServerConfig {
	return {
		cache: {
			keyPrefix: "next-web:default",
			filePath: "./.cache/",
			defaultTTL: 300,
			longTTL: 86400,
			refreshThreshold: 150,
		},
		feeds: {
			publications: {
				origin: "",
				apiKey: "",
			},
			inDev: {
				origin: "",
				apiKey: "",
			},
			jotForm: {
				apiKey: "",
			},
		},
	};
}

// Simple deep merge function for config objects
function deepMerge<T extends Record<string, unknown>>(
	target: T,
	source: Partial<T>
): T {
	const result = { ...target };

	for (const key in source) {
		const sourceValue = source[key];
		if (
			sourceValue &&
			typeof sourceValue === "object" &&
			!Array.isArray(sourceValue)
		) {
			result[key] = deepMerge(
				(result[key] || {}) as Record<string, unknown>,
				sourceValue as Record<string, unknown>
			) as T[Extract<keyof T, string>];
		} else {
			result[key] = sourceValue as T[Extract<keyof T, string>];
		}
	}

	return result;
}

// Load server config once on server startup
let _serverRuntimeConfig: ServerConfig | null = null;

function getServerRuntimeConfig(): ServerConfig {
	if (_serverRuntimeConfig === null) {
		_serverRuntimeConfig = loadServerConfig();
	}
	return _serverRuntimeConfig;
}

// Export a getter that loads config lazily
export const serverRuntimeConfig = new Proxy({} as ServerConfig, {
	get(target: ServerConfig, prop: string | symbol): unknown {
		const config = getServerRuntimeConfig();
		return config[prop as keyof ServerConfig];
	},
});

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

	/** Name of the auth environment which is passed through to global nav */
	readonly authEnvironment: "live" | "beta" | "test" | "local";

	/** Disallow crawlers from indexing the site */
	readonly denyRobots: boolean;

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
}

export { publicRuntimeConfig };
