import { type GetServerSidePropsContext } from "next";

import { serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

import { buildTree, ExtendedSBLink } from "./Utils";

// Default to 6 hours if env var is not set
// export const sectionNavCacheTTL_MS =
// 	(serverRuntimeConfig?.cache?.sectionNavCacheTTL ?? 21600) * 1000;

// NOTE Hardcoded cache duration because serverRuntime is falsey for some reason...
export const sectionNavCacheTTL_MS = 15 * 1000; // 15 seconds for dev testing

// Stale-while-revalidate config:
// Fresh window = standard TTL from config
// Stale window = allow serving stale content for up to 1h after fresh window
export const FRESH_TTL = sectionNavCacheTTL_MS; // fresh window
// export const STALE_TTL = sectionNavCacheTTL_MS + 60 * 60 * 1000; // stale allowed for 1h after expiry
export const STALE_TTL = sectionNavCacheTTL_MS + 60 * 1000; // 60s stale after fresh

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
	// const ttl = serverRuntimeConfig?.cache?.sectionNavCacheTTL;
	// const isCachingEnabled = !!ttl && ttl > 0;

	// NOTE hardcoded ttl as server runtime is undefined for some reason...
	 const isCachingEnabled = sectionNavCacheTTL_MS > 0;

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

		if (entry) {
			const age = now - entry.lastFetched;

			if (age < FRESH_TTL) {
				status = "HIT";
				tree = entry.data;
			} else if (age < STALE_TTL) {
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
			`${sectionNavCacheTTL_MS / 1000}s`
		);
	}

	return tree;
};
