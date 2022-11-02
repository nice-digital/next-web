import { type Readable } from "stream";

import axios, { type AxiosInstance } from "axios";
import applyCaseMiddleware from "axios-case-converter";

import { cache, getCacheKey } from "@/cache";

export const client: AxiosInstance = applyCaseMiddleware(axios.create());

/**
 * Gets the body of a feed directly from the back end system
 *
 * @param path The path of the feed to request
 * @returns The body of the feed
 */
export const getFeedBodyUnCached = async <TResponse>(
	origin: string,
	path: string,
	apiKey: string
): Promise<TResponse> => {
	const { data } = await client.get<TResponse>(origin + path, {
		headers: {
			"Api-Key": apiKey,
		},
	});
	return data;
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
): Promise<T> =>
	cache.wrap<T>(getCacheKey(groupCacheKey, path), getUncachedAction, { ttl });

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
	const { data } = await axios.get<Readable>(origin + path, {
		headers: {
			"Api-Key": apiKey,
		},
		responseType: "stream",
		maxBodyLength: Infinity,
	});
	return data;
};
