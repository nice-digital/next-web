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
