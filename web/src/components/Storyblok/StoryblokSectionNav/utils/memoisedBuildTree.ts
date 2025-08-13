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

const cache = new Map<string, CacheEntry<ExtendedSBLink[]>>();

/**
 * Clean up expired cache entries
 */
function cleanupExpiredEntries(): number {
	const now = Date.now();
	const staleTTL = getStaleTTL();
	let cleanedCount = 0;

	// Use Array.from to convert iterator for compatibility
	const entries = Array.from(cache.entries());
	for (const [key, entry] of entries) {
		if (now - entry.lastFetched > staleTTL) {
			cache.delete(key);
			cleanedCount++;
		}
	}

	if (cleanedCount > 0) {
		logger.warn(
			`Section navigation cache: cleaned up ${cleanedCount} expired entries`
		);
	}

	return cleanedCount;
}

/**
 * Start periodic cleanup of expired cache entries
 * Runs every hour to prevent memory leaks
 */
function startPeriodicCleanup(): NodeJS.Timeout {
	const cleanupInterval = 60 * 60 * 1000; // 1 hour
	logger.warn(
		"Section navigation cache: starting periodic cleanup (every 1 hour)"
	);

	return setInterval(() => {
		cleanupExpiredEntries();
	}, cleanupInterval);
}

// Start the cleanup when module loads
let cleanupTimer: NodeJS.Timeout | null = null;
if (typeof global !== "undefined") {
	// Only start cleanup in server environment
	cleanupTimer = startPeriodicCleanup();
}

/**
 * Stop periodic cleanup (useful for testing or cleanup)
 */
export function stopPeriodicCleanup(): void {
	if (cleanupTimer) {
		clearInterval(cleanupTimer);
		cleanupTimer = null;
		logger.warn("Section navigation cache: stopped periodic cleanup");
	}
}

/**
 * Manually trigger cleanup and return count of cleaned entries
 */
export function manualCleanup(): number {
	return cleanupExpiredEntries();
}

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

async function backgroundRefresh(
	key: string,
	fetchFn: () => Promise<ExtendedSBLink[]>
): Promise<void> {
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
export function purgeCache(key?: string): void {
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
				cache.delete(cacheKey); // Clean up expired entry
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
		res.setHeader("X-Section-Navigation-Cache-TTL", `${currentTTL / 1000}s`);
	}

	return tree;
};
