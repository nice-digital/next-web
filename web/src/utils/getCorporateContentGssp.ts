import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { publicRuntimeConfig } from "@/config";
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

export const getCorporateContentGssp = (
	basePath: string
): GetServerSideProps => {
	return async function (context: GetServerSidePropsContext) {

		const { query, params } = context;

		let slug = getSlugFromParams(params?.slug);

		if (basePath) {
			slug = slug ? `${basePath}/${slug}` : basePath;
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
					`Story not found for slug: ${slug} in root [...slug] catch all.`
				);
				return { notFound: true };
			}

			const siblingPages = [];

			const component = storyResult.story?.content?.component;
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
};
