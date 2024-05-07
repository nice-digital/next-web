import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	try {
		const accessToken = publicRuntimeConfig.storyblok.previewAccessToken;
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
	} catch (e) {
		logger.error("Error initialising Storyblok:", e);
	}
};
