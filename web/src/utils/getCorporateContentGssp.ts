import { logger } from "@/logger";
import {
	InfoPageStoryblok,
	CategoryNavigationStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	GENERIC_ERROR_MESSAGE,
	getBreadcrumbs,
	getSlugFromParams,
	getStoryVersionFromQuery,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext, GetServerSideProps } from "next";

export const getBasePathFromSlugAndUrl = (resolvedUrl: string, slug: string | undefined): string => {
	const raw = resolvedUrl.split("?")[0].replace(/\/+$/, ""); // strip trailing slashes

	if (!slug) return raw.replace(/^\/|\/$/g, "");

	const slugParts = slug.split("/");
	const basePathParts = raw.split("/").slice(0, -slugParts.length);
	return basePathParts.join("/").replace(/^\/|\/$/g, "");
}

export const getCorporateContentGssp = (templateId = "unknown"): GetServerSideProps => {
	return async function (context: GetServerSidePropsContext) {

		const { query, params, res, resolvedUrl } = context;

		const rawSlug = getSlugFromParams(params?.slug);
		const basePath = getBasePathFromSlugAndUrl(resolvedUrl, rawSlug);

		let slug = rawSlug;

		if (basePath) {
			slug = rawSlug ? `${basePath}/${rawSlug}` : basePath;
		}

		if (!slug) {
			return {
				notFound: true,
			};
		}

		try {
			const version = getStoryVersionFromQuery(query);

			const [storyResult, breadcrumbs] = await Promise.all([
				fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(
					slug,
					version
				),
				getBreadcrumbs(slug, version),
			]);

			// will return a 404 if the story is not found
			if ("notFound" in storyResult && storyResult.notFound) {
				logger.error(
					`Story not found for slug: ${slug} in getCorporateContentGssp [[...slug]] catch all at ${resolvedUrl}`
				);
				return { notFound: true };
			}

			const siblingPages = [];

			const component = storyResult.story?.content?.component;

			if (component) {
				res.setHeader("X-Page-Template-ID", `component:${component} template: ${templateId}`);
			} else {
				res.setHeader("X-Page-ID-Template-ID", `slug:${slug} template: ${templateId}`);
			}

			// TODO: Use the Storyblok Links API to build a map of sibling & optionally child pages
			if (component === "infoPage") {
				siblingPages.push(...["page1", "page2"]);
			}

			const result = {
				props: {
					...storyResult,
					breadcrumbs,
					siblingPages,
					component,
				},
			};

			return result;
		} catch (error) {
			// {
			// 	errorCause: error instanceof Error && error.cause,
			// 	requestHeaders: context.req.headers,
			// },
			logger.error(
				`Error fetching story for slug: ${slug} in SlugCatchAll page getServerSideProps.`
			);
			return {
				props: {
					error: GENERIC_ERROR_MESSAGE,
				},
			};
		}
	};
}
