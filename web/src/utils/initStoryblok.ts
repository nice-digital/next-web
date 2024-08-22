import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
<<<<<<< HEAD
	const accessToken = publicRuntimeConfig.storyblok.accessToken;
	const endpoint = publicRuntimeConfig.storyblok.ocelotEndpoint;
	const usingOcelotCache = !!endpoint;

	try {
		logger.info(
			`start initStoryblok with accessToken: ${accessToken} and endpoint: ${endpoint}`
		);

		logger.info(`initStoryblok usingOcelotCache: ${usingOcelotCache}`);
=======
	try {
		const accessToken = publicRuntimeConfig.storyblok.accessToken;
		const endpoint = publicRuntimeConfig.storyblok.ocelotEndpoint;
		const usingOcelotCache = !!endpoint;
>>>>>>> main

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
<<<<<<< HEAD
		logger.error(
			{
				ocelotEndpoint: endpoint,
				usingOcelotCache,
				originatingError: error instanceof Error && error.message,
				error,
			},
			`Error initialising Storyblok: ${error}`
		);
		new Error("Error initialising Storyblok", { cause: error });
	}
	logger.info("end initStoryblok");
=======
		logger.error("Error initialising Storyblok:", error);
		new Error("Error initialising Storyblok", { cause: error });
	}
>>>>>>> main
};
