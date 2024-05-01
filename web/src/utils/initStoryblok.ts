import { apiPlugin, storyblokInit } from "@storyblok/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";

// Init connection to Storyblok
export const initStoryblok = (): void => {
	try {
		// const accessToken = publicRuntimeConfig.storyblok.previewAccessToken;
		const accessToken = "yU8uloicMxBRDuiNAWQkmgtt"; // TEMP STUFF! DO NOT CHECK IN!

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			apiOptions: {
				cache: {
					clear: "auto",
					type: "memory",
				},
			},
		});
	} catch (e) {
		logger.error("Error initialising Storyblok:", e);
	}
};
