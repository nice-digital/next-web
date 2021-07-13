import { caching, Cache } from "cache-manager";
import store from "cache-manager-fs-hash";

import { serverRuntimeConfig } from "@/config";

const { keyPrefix, defaultTTL, refreshThreshold, filePath } =
	serverRuntimeConfig.cache;

/**
 * Returns a cache key generated from the given prefix and postfix.
 *
 * Note: it's also prefixed with a global cache key prefix that comes from config.
 *
 * @example
 * 	const cacheKey = getCacheKey("publications", "products")
 * 	// returns "next-web:local:publications:products";
 *
 * @param groupKey The prefix for a group of cached objects e.g. "publications"
 * @param itemKey The individual cache key for the entry
 * @returns The generated cache key, prefixed with the global cache key prefix.
 */
export const getCacheKey = (groupKey: string, itemKey: string): string =>
	`${keyPrefix}:${groupKey}:${itemKey}`;

/**
 * A file-system/disk cache using cache-manager-fs-hash.
 *
 * We use fs-hash because it supports clustering, via lock files. We use clustering
 * via PM2 in production, so a memory cache wouldn't be suitable: memory is isolated to each
 * process in cluster mode.
 *
 * FS is slower than in-memory but the tradeoff is not having cache syncing issues and persisting cache between
 * app restarts/deployments. The cache will hopefully be replaced by a separate API gateway microservice
 * ("backend for front end") layer, backed by Redis. But FS will do for the time-being.
 */
export const cache: Readonly<Cache> = caching({
	store,
	options: {
		path: filePath,
		ttl: defaultTTL,
		subdirs: true,
	},
	// Using a sensible refreshThreshold allows use to almost follow a SWR (stale while relvalidate) approach.
	// 'Almost' meaning we don't relvalidate on every cache access as we don't need to be that up-to-date but we
	// revalidate regularly. We have enough traffic that this should mean a lot of the time things are always in cache.
	refreshThreshold,
});
