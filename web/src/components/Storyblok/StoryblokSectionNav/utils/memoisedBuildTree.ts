import { type GetServerSidePropsContext } from "next";

import { serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

import { buildTree, ExtendedSBLink } from "./Utils";

/**
 * Get the section navigation cache TTL in milliseconds from runtime config
 * Falls back to 21600 seconds (6 hours) if not configured
 */
function getSectionNavCacheTTL_MS(): number {
	const ttlSeconds = serverRuntimeConfig?.cache?.sectionNavCacheTTL ?? 21600;
	return ttlSeconds * 1000;
}

/**
 * Get the fresh TTL (cache expiry time) in milliseconds
 */
function getFreshTTL(): number {
	return getSectionNavCacheTTL_MS();
}

/**
 * Get the stale TTL (stale-while-revalidate window) in milliseconds
 * Allows serving stale content for 1 minute after fresh TTL expires
 */
function getStaleTTL(): number {
	return getSectionNavCacheTTL_MS() + 60 * 1000; // 60s stale after fresh
}

// Export these for backwards compatibility and testing
export const sectionNavCacheTTL_MS = getSectionNavCacheTTL_MS();
export const FRESH_TTL = getFreshTTL();
export const STALE_TTL = getStaleTTL();

type CacheEntry<T> = {
	data: T;
	lastFetched: number;
};

const cache = new Map<string, CacheEntry<any>>();

/**
 * The original, uncached buildTree function
 */
const rawBuildTree = async (
	parentID: number,
	slug: string,
	isRootPage?: boolean
): Promise<ExtendedSBLink[]> => {
	const start = Date.now();
	logger.warn(
		`Calling ORIGINAL buildTree (not memoised) for slug: "${slug}", parentID: ${parentID}, isRootPage: ${isRootPage}`
	);
	const result = await buildTree(parentID, slug, isRootPage);
	const duration = Date.now() - start;
	logger.warn(
		`in section navigation buildTree execution time for slug: "${slug}", parentID: ${parentID}, isRootPage: ${isRootPage} = ${duration}ms`
	);
	return result;
};

async function backgroundRefresh<T>(
	key: string,
	fetchFn: () => Promise<T>
) {
	fetchFn()
		.then((data) => {
			cache.set(key, { data, lastFetched: Date.now() });
			logger.warn(`Background refresh completed for ${key}`);
		})
		.catch((err) => {
			logger.error(`Background refresh failed for ${key}:`, err);
		});
}

/**
 * Purge the whole cache or a specific key
 */
export function purgeCache(key?: string) {
	if (key) {
		cache.delete(key);
	} else {
		cache.clear();
	}
}

/**
 * Main cache-aware wrapper
 */
export const buildTreeWithOptionalCache = async (
	parentID: number,
	slug: string,
	isRootPage: boolean | undefined,
	res?: GetServerSidePropsContext["res"]
): Promise<ExtendedSBLink[]> => {
	// Get current TTL values dynamically from config
	const currentTTL = getSectionNavCacheTTL_MS();
	const isCachingEnabled = currentTTL > 0;

	const start = Date.now();
	let status = "UNKNOWN";
	let tree: ExtendedSBLink[];

	const cacheKey = `${parentID}_${slug}_${isRootPage ?? false}`;
	const now = Date.now();

	if (!isCachingEnabled) {
		status = "BYPASSED";
		logger.warn(
			`In section navigation memoisation BYPASSED - calling buildTree for "${slug}"`
		);
		tree = await rawBuildTree(parentID, slug, isRootPage);
	} else {
		const entry = cache.get(cacheKey);
		const freshTTL = getFreshTTL();
		const staleTTL = getStaleTTL();

		if (entry) {
			const age = now - entry.lastFetched;

			if (age < freshTTL) {
				status = "HIT";
				tree = entry.data;
			} else if (age < staleTTL) {
				status = "STALE";
				tree = entry.data;
				// Trigger background refresh but don't block
				backgroundRefresh(cacheKey, () =>
					rawBuildTree(parentID, slug, isRootPage)
				);
			} else {
				status = "REFETCH_AFTER_EXPIRY";
				tree = await rawBuildTree(parentID, slug, isRootPage);
				cache.set(cacheKey, { data: tree, lastFetched: now });
			}
		} else {
			status = "MISS";
			tree = await rawBuildTree(parentID, slug, isRootPage);
			cache.set(cacheKey, { data: tree, lastFetched: now });
		}
	}

	const duration = Date.now() - start;

	if (res) {
		res.setHeader("X-Section-Navigation-Cache", status);
		res.setHeader("X-Section-Navigation-BuildTime", `${duration}ms`);
		res.setHeader(
			"X-Section-Navigation-Cache-TTL",
			`${currentTTL / 1000}s`
		);
	}

	return tree;
};
