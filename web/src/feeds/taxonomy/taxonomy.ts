import axios, { type AxiosInstance } from "axios";
import applyCaseMiddleware from "axios-case-converter";

import { serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

import { getFeedBodyCached } from "../";

import { FeedPath, TaxonomyProductMappings } from "./types";

export * from "./types";

export const client: AxiosInstance = applyCaseMiddleware(
	axios.create({
		headers: { accept: "application/json" },
	})
);

const cacheKeyPrefix = "taxonomy",
	{ longTTL } = serverRuntimeConfig.cache,
	{ origin, apiKey } = serverRuntimeConfig.feeds.taxonomy;

/**
 * Gets the taxonomy data from the 'topicBrowseProductMappings' endpoint.
 * @returns topicBrowseProductMappings object or empty object if it fails
 */
export const getTaxonomyProductMappings =
	async (): Promise<TaxonomyProductMappings> =>
		await getFeedBodyCached<TaxonomyProductMappings>(
			cacheKeyPrefix,
			FeedPath.TopicBrowseProductMappings,
			longTTL,
			async () => {
				try {
					const { data } = await client.get<TaxonomyProductMappings>(
						origin + FeedPath.TopicBrowseProductMappings,
						{
							headers: {
								"x-api-key": apiKey,
								Accept: "application/json",
							},
							validateStatus: (status: number) => {
								// We don't want feed 404 responses to throw an error, so that we can show users a not found page rather than a server error.
								return (status >= 200 && status < 300) || status == 404;
							},
						}
					);

					return data;
				} catch (error) {
					logger.error(
						`Error fetching taxonomy feed - url: ${
							origin + FeedPath.TopicBrowseProductMappings
						}, error: ${error instanceof Error ? error.message : String(error)}`
					);

					return {} as TaxonomyProductMappings;
				}
			}
		);
