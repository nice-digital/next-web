import mem from "mem";
import { buildTree, ExtendedSBLink } from "./Utils";
import { logger } from "@/logger";
import { serverRuntimeConfig } from "@/config";

export const sectionNavCacheTTL_MS = (serverRuntimeConfig?.cache?.sectionNavCacheTTL ?? 21600) * 1000; // default to 6 hours if env var is not set

export const memoisedBuildTree = mem(
  async (
    parentID: number,
    slug: string,
    isRootPage?: boolean
  ): Promise<ExtendedSBLink[]> => {
    const start = Date.now();
    logger.warn(`Calling ORIGINAL buildTree (not memoised) for slug: "${slug}", parentID: ${parentID}, isRootPage: ${isRootPage}`);
    const result = await buildTree(parentID, slug, isRootPage);
    const duration = Date.now() - start;
    logger.warn(
      `buildTree execution time for slug: "${slug}", parentID: ${parentID}, isRootPage: ${isRootPage} = ${duration}ms`
    );
    return result;
},
{
	maxAge: sectionNavCacheTTL_MS,
	cacheKey: ([parentID, slug, isRootPage]: [number, string, boolean?]) => {
      const key = `${parentID}_${slug}_${isRootPage ?? false}`;
	  logger.warn(`sectionNavCacheTTL_MS: ${sectionNavCacheTTL_MS}`)
      logger.warn(`Generated buildTree cache key: ${key}`);
      return key;
    },
  }
);
