import mem from "mem";
import { buildTree, ExtendedSBLink } from "./Utils";
import { logger } from "@/logger";

export const memoisedBuildTree = mem(
  async (
    parentID: number,
    slug: string,
    isRootPage?: boolean
  ): Promise<ExtendedSBLink[]> => {
    logger.warn(`Calling ORIGINAL buildTree (not memoised) for slug: "${slug}", parentID: ${parentID}, isRootPage: ${isRootPage}`);
    return await buildTree(parentID, slug, isRootPage);
  },
  {
    maxAge: 1000 * 60 * 2, // 2 minutes
    cacheKey: ([parentID, slug, isRootPage]: [number, string, boolean?]) => {
      const key = `${parentID}_${slug}_${isRootPage ?? false}`;
      logger.warn(`Generated buildTree cache key: ${key}`);
      return key;
    },
  }
);
