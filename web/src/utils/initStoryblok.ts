import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	const accessToken = publicRuntimeConfig.storyblok.accessToken;
	const endpoint = publicRuntimeConfig.storyblok.ocelotEndpoint;
	const usingOcelotCache = !!endpoint;

	try {
		logger.info(
			`start initStoryblok with accessToken: ${accessToken} and endpoint: ${endpoint}`
		);

		logger.info(`initStoryblok usingOcelotCache: ${usingOcelotCache}`);

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			apiOptions: {
				cache: {
					clear: usingOcelotCache ? "manual" : "auto",
					type: usingOcelotCache ? "none" : "memory",
				},
				endpoint,
			},
		});
	} catch (error) {
		logger.error(
			{
				ocelotEndpoint: endpoint,
				usingOcelotCache,
				error,
			},
			`Error initialising Storyblok: ${error}`
		);
		new Error("Error initialising Storyblok", { cause: error });
	}
	logger.info("end initStoryblok");
};
