//import config from "config";
import getConfig from "next/config";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

/**
 * Public run time config, available to both client and server
 */
export interface PublicConfig {
	/** Name of the environment e.g. _dev_ or _test_ */
	readonly environment: string;

	/** The base URL of the website including protocol and port e.g. http://localhost:3000 for local dev or http://dev.nice.org.uk.
	 *
	 * **Note** the lack of trailing slash! It will get prepended to paths that start with a slash. */
	readonly baseUrl: string;

	/**
	 * The absolute URL to the NICE cookie banner script include
	 */
	readonly cookieBannerScriptUrl: string;

	/**
	 * The base URL to the deployed NextJS _public_ folder, see https://nextjs.org/docs/basic-features/static-file-serving.
	 * Empty string means relative to the deployed app. Set it to an absolute path in _config.yml_ to use a CDN.
	 */
	readonly publicBaseUrl: string;
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
}

/**
 * Server-only run time config, useful for secrets etc
 */
export interface ServerConfig {
	feeds: FeedsConfig;
}

export { publicRuntimeConfig, serverRuntimeConfig };
