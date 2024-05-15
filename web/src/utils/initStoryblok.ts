import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig, serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	try {
		const accessToken = publicRuntimeConfig.storyblok.storyblokApiKey;

		const endpoint = publicRuntimeConfig.storyblok.ocelotEndpoint;
		const usingOcelotCache = !!endpoint;

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
		logger.error("Error initialising Storyblok:", error);
		new Error("Error initialising Storyblok", { cause: error });
	}
};
