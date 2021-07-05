//import config from "config";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export interface PublicConfig {
	/** Name of the environment e.g. "dev" or "test" */
	environment: string;
	/** The base URL of the website including protocol and port e.g. http://localhost:3000 for local dev or http://dev.nice.org.uk */
	baseUrl: string;
}

export { publicRuntimeConfig };
