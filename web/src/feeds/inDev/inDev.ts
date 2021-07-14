import { getFeedBodyCached, getFeedBodyUnCached } from "..";
import { Project, FeedPath, AllProjects } from "./types";

import { serverRuntimeConfig } from "@/config";

export * from "./types";

const cacheKeyPrefix = "inDev",
	{ defaultTTL } = serverRuntimeConfig.cache,
	{ origin, apiKey } = serverRuntimeConfig.feeds.inDev;

export const getAllProjects = async (): Promise<Project[]> =>
	await getFeedBodyCached<Project[]>(
		cacheKeyPrefix,
		FeedPath.AllProjects,
		defaultTTL,
		async () =>
			(
				await getFeedBodyUnCached<AllProjects>(
					origin,
					FeedPath.AllProjects,
					apiKey
				)
			)._embedded["nice.indev:indevelopment-project"]
	);
