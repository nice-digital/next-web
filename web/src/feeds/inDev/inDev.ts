import { serverRuntimeConfig } from "@/config";
import { logger } from "@/logger";

import { getFeedBodyCached, getFeedBodyUnCached, getResponseStream } from "..";
import {
	isErrorResponse,
	isSuccessResponse,
} from "../publications/publications";
import { ErrorResponse } from "../publications/types";

import {
	Project,
	FeedPath,
	AllProjects,
	Consultation,
	InConsultationProjects,
	ProjectDetail,
} from "./types";

export * from "./types";

const cacheKeyPrefix = "indev",
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
): Promise<ProjectDetail | null> => {
	try {
		return await getFeedBodyCached<ProjectDetail | null>(
			cacheKeyPrefix,
			FeedPath.ProjectDetail + inDevReference,
			longTTL,
			async () => {
				const response = await getFeedBodyUnCached<ProjectDetail | "">(
					origin,
					FeedPath.ProjectDetail + inDevReference,
					apiKey
				);

				return response === "" || isErrorResponse(response) ? null : response;
			}
		);
	} catch (error) {
		logger.error(
			`Failed to get project detail - inDevReference: ${inDevReference}, error: ${
				error instanceof Error ? error.message : String(error)
			} `
		);
		return null;
	}
};

/**
 * Gets HTML of a resource from InDev,
 *
 * E.g. from /guidance/NG100/documents/html-content
 *
 */
export const getResourceFileHTML = async (
	resourcePath: string
): Promise<string | null> => {
	const body = await getFeedBodyUnCached<string | ErrorResponse>(
		origin,
		resourcePath,
		apiKey,
		"text/html"
	);

	return isSuccessResponse(body) ? body : null;
};

/**
 * Gets a stream of a file from indev.
 *
 * @param filePath The relative path of the endpoint that serves file content, e.g. `/guidance/NG100/documents/draft-guideline`
 * @returns A readable stream of the file contents
 */
export const getFileStream = async (
	filePath: string
): Promise<ReturnType<typeof getResponseStream>> =>
	getResponseStream(origin, filePath, apiKey);
