import { apiPlugin, storyblokInit } from "@storyblok/react";

import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	try {
		const accessToken = process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN;
		const endpoint = process.env.STORYBLOK_OCELOT_ENDPOINT;
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
