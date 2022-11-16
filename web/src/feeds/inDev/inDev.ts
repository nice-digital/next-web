import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached } from "..";
import { ErrorResponse } from "../publications/types";

import {
	Project,
	FeedPath,
	AllProjects,
	Consultation,
	InConsultationProjects,
	ProjectDetail,
	IndevPanel,
} from "./types";

export * from "./types";

const cacheKeyPrefix = "inDev",
	{ defaultTTL, longTTL } = serverRuntimeConfig.cache,
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

/**
 * Gets a project detail.
 *
 */

export const getProjectDetail = async (
	inDevReference: string
): Promise<ProjectDetail | ErrorResponse> =>
	//TODO don't cache error response
	await getFeedBodyCached<ProjectDetail | ErrorResponse>(
		cacheKeyPrefix,
		FeedPath.ProjectDetail + inDevReference,
		longTTL,
		async () =>
			await getFeedBodyUnCached<ProjectDetail | ErrorResponse>(
				origin,
				FeedPath.ProjectDetail + inDevReference,
				apiKey
			)
	);
