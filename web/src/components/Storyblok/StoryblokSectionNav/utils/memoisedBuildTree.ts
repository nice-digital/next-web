import mem from "mem";
import { buildTree, ExtendedSBLink } from "./Utils";
import { logger } from "@/logger";
import { serverRuntimeConfig } from "@/config";
import type { GetServerSidePropsContext } from "next";

// Default to 6 hours if env var is not set
export const sectionNavCacheTTL_MS =
  (serverRuntimeConfig?.cache?.sectionNavCacheTTL ?? 21600) * 1000;

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

const memoisedBuildTree = mem(rawBuildTree, {
  maxAge: sectionNavCacheTTL_MS,
  cacheKey: ([parentID, slug, isRootPage]: [number, string, boolean?]) => {
    const key = `${parentID}_${slug}_${isRootPage ?? false}`;
    return key;
  },
});

// Tracks when each key was last refreshed to detect HIT vs MISS
const cacheTimestamps = new Map<string, number>();

// Clean up expired timestamps to avoid unbounded memory growth
const purgeExpiredTimestamps = () => {
  const now = Date.now();
  cacheTimestamps.forEach((timestamp, key) => {
    if (now - timestamp > sectionNavCacheTTL_MS) {
      cacheTimestamps.delete(key);
    }
  });
};

export const buildTreeWithOptionalCache = async (
  parentID: number,
  slug: string,
  isRootPage: boolean | undefined,
  res?: GetServerSidePropsContext["res"]
): Promise<ExtendedSBLink[]> => {
  purgeExpiredTimestamps(); // remove expired entries

  const ttl = serverRuntimeConfig?.cache?.sectionNavCacheTTL;
  const isCachingEnabled = !!ttl && ttl > 0;

  const start = Date.now();
  let status = "UNKNOWN";
  let tree: ExtendedSBLink[];

  const cacheKey = `${parentID}_${slug}_${isRootPage ?? false}`;

  if (!isCachingEnabled) {
    status = "BYPASSED";
    logger.warn(
      `In section navigation memoisation BYPASSED - calling buildTree for "${slug}"`
    );
    tree = await rawBuildTree(parentID, slug, isRootPage);
  } else {
    const now = Date.now();
    const lastCachedAt = cacheTimestamps.get(cacheKey);
    const isFresh = lastCachedAt !== undefined && (now - lastCachedAt < sectionNavCacheTTL_MS);

    status = isFresh ? "HIT" : "MISS";

    tree = await memoisedBuildTree(parentID, slug, isRootPage);

    // Update timestamp on every access
    cacheTimestamps.set(cacheKey, now);
  }

  const duration = Date.now() - start;

  if (res) {
    res.setHeader("X-Section-Navigation-Cache", status);
    res.setHeader("X-Section-Navigation-BuildTime", `${duration}ms`);
		res.setHeader("X-Section-Navigation-Cache-TTL", `${sectionNavCacheTTL_MS / 1000}s`);
  }

  return tree;
};
