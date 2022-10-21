import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached } from "..";

import {
	Project,
	FeedPath,
	AllProjects,
	Consultation,
	InConsultationProjects,
} from "./types";

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
			).embedded.niceIndevIndevelopmentProject
	);

export const getAllConsultations = async (): Promise<Consultation[]> =>
	await getFeedBodyCached<Consultation[]>(
		cacheKeyPrefix,
		FeedPath.InConsultationProjects,
		defaultTTL,
		async () =>
			(
				await getFeedBodyUnCached<InConsultationProjects>(
					origin,
					FeedPath.InConsultationProjects,
					apiKey
				)
			)?.embedded?.niceIndevInconsultationProduct || []
	);
