import { type Readable } from "stream";

import axios, { type AxiosInstance } from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { camelCase } from "camel-case";

import { cache, getCacheKey } from "@/cache";
import { logger } from "@/logger";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

export const client: AxiosInstance = applyCaseMiddleware(
	axios.create({
		headers: { accept: "application/json" },
	}),
	{
		caseFunctions: {
			camel: (input, _options) => {
				// Strip out the prefix from all the embedded keys as it creates so much noise
				return camelCase(input.replace("nice.publications:", ""));
			},
		},
	}
);

/**
 * Gets the body of a feed directly from the back end system
 *
 * @param path The path of the feed to request
 * @returns The body of the feed
 */
export const getFeedBodyUnCached = async <TResponse>(
	origin: string,
	path: string,
	apiKey: string,
	acceptHeader = "application/json"
): Promise<TResponse> => {
	try {
		const requestUrl = origin + path;
		const { data } = await client.get<TResponse>(requestUrl, {
			headers: {
				"Api-Key": apiKey,
				Accept: acceptHeader,
			},
			validateStatus: (status: number) => {
				// We don't want feed 404 responses to throw an error, so that we can show users a not found page rather than a server error.
				return (status >= 200 && status < 300) || status == 404;
			},
		});

		return data;
	} catch (error) {
		// Something unexpected went wrong - this could include network errors, invalid URLs, or too many redirects
		logger.error(
			`Error fetching uncached feed - url: ${origin + path}, error: ${
				error instanceof Error ? error.message : String(error)
			}`
		);

		// Re-throw a generic error message to avoid exposing implementation details
		throw new Error(GENERIC_ERROR_MESSAGE);
	}
};

/**
 * Gets the body of a feed from the cache, if it exists.
 * If the item isn't in cache then it will call the `getUncachedAction` function to get fresh data.
 *
 * @param path The path of the feed endpoint to request
 * @param ttl The TTL (time to live) of the entry
 * @param getUncachedAction Function that gets the uncached feed directly from the back end.
 * @returns The body of the feed
 */
export const getFeedBodyCached = async <T>(
	groupCacheKey: string,
	path: string,
	ttl: number,
	getUncachedAction: () => Promise<T>
): Promise<T> => {
	try {
		return await cache.wrap<T>(
			getCacheKey(groupCacheKey, path),
			getUncachedAction,
			{ ttl }
		);
	} catch (error) {
		logger.error(
			`Error retrieving feed from cache or fallback - cacheKey: ${getCacheKey(
				groupCacheKey,
				path
			)}, error: ${error instanceof Error ? error.message : String(error)}`
		);

		throw new Error(GENERIC_ERROR_MESSAGE);
	}
};

/**
 * Gets a response stream from a remote API endpoint, usually used for binary files e.g. PDFs (or mobi/epub etc).
 *
 * @param origin The base URL of the endpoint
 * @param path The path to the endpoint e.g. `/feeds/downloads/737585a0-dad7-4a37-875b-b30b09c3fdc3`
 * @param apiKey The API key for authentication against the API
 * @returns A readable response stream
 */
export const getResponseStream = async (
	origin: string,
	path: string,
	apiKey: string
): Promise<Readable> => {
	try {
		const { data } = await axios.get<Readable>(origin + path, {
			headers: {
				"Api-Key": apiKey,
			},
			responseType: "stream",
			maxBodyLength: Infinity,
		});
		return data;
	} catch (error) {
		logger.error(
			`Error fetching response stream - url: ${origin + path}, error: ${
				error instanceof Error ? error.message : String(error)
			}`
		);

		throw new Error(GENERIC_ERROR_MESSAGE);
	}
};
