import { type GetServerSidePropsContext } from "next";

import { serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

import { buildTree, ExtendedSBLink } from "./Utils";

/** Fallback fresh TTL, in seconds (6 hours), used when config is absent. */
const DEFAULT_TTL_SECONDS = 21600;

/**
 * How long, as a multiple of the fresh TTL, a cached entry may be served stale
 * (with a background refresh) after it expires. Scaling off the fresh TTL keeps
 * the stale window proportional to configured freshness rather than a fixed
 * duration that could dwarf a short TTL.
 */
const STALE_TTL_MULTIPLIER = 2;

/**
 * Get the section navigation cache TTL in milliseconds from runtime config.
 * Read live on every call so config/test overrides take effect without
 * depending on module import order. Falls back to 6 hours if not configured.
 */
function getSectionNavCacheTTL_MS(): number {
	const ttlSeconds =
		serverRuntimeConfig?.cache?.sectionNavCacheTTL ?? DEFAULT_TTL_SECONDS;
	return ttlSeconds * 1000;
}

/**
 * Get the fresh TTL (cache expiry time) in milliseconds.
 */
function getFreshTTL(): number {
	return getSectionNavCacheTTL_MS();
}

/**
 * Get the stale TTL (stale-while-revalidate window) in milliseconds.
 * The stale window scales with the fresh TTL so a short TTL does not end up
 * serving stale content for a disproportionately long time.
 */
function getStaleTTL(): number {
	return getFreshTTL() * STALE_TTL_MULTIPLIER;
}

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
 * Start periodic cleanup of expired cache entries.
 * Runs every hour to prevent unbounded growth of the in-process cache.
 *
 * The interval is unref'd so it never keeps the Node process (or a Jest
 * worker) alive on its own; it only runs while the process is otherwise busy.
 */
function startPeriodicCleanup(): NodeJS.Timeout {
	const cleanupInterval = 60 * 60 * 1000; // 1 hour
	logger.warn(
		"Section navigation cache: starting periodic cleanup (every 1 hour)"
	);

	const timer = setInterval(() => {
		cleanupExpiredEntries();
	}, cleanupInterval);

	// Don't let the cleanup timer hold the event loop open.
	timer.unref?.();

	return timer;
}

// Start cleanup lazily on first cache write (server-side only). Importing the
// module - e.g. in a test or on the client - no longer schedules a timer.
let cleanupTimer: NodeJS.Timeout | null = null;

/** Running server-side (not in the browser)? */
const isServer = typeof window === "undefined";

function ensurePeriodicCleanup(): void {
	if (isServer && !cleanupTimer) {
		cleanupTimer = startPeriodicCleanup();
	}
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
			ensurePeriodicCleanup();
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
				ensurePeriodicCleanup();
			}
		} else {
			status = "MISS";
			tree = await rawBuildTree(parentID, slug, isRootPage);
			cache.set(cacheKey, { data: tree, lastFetched: now });
			ensurePeriodicCleanup();
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
