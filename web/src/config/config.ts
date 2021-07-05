//import config from "config";
import getConfig from "next/config";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

/**
 * Public run time config, available to both client and server
 */
export interface PublicConfig {
	/** Name of the environment e.g. _dev_ or _test_ */
	environment: string;

	/** The base URL of the website including protocol and port e.g. http://localhost:3000 for local dev or http://dev.nice.org.uk.
	 *
	 * **Note** the lack of trailing slash! It will get prepended to paths that start with a slash. */
	baseUrl: string;
}

/**
 * Server-only run time config, useful for secrets etc
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerConfig {
	// Add types for server config here
}

export { publicRuntimeConfig, serverRuntimeConfig };
