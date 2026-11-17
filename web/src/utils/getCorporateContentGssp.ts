import {
	buildTree,
	type ExtendedSBLink,
} from "@/components/Storyblok/StoryblokSectionNav/utils/Utils";
import { logger } from "@/logger";
import {
	InfoPageStoryblok,
	CategoryNavigationStoryblok,
	TracPageStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	GENERIC_ERROR_MESSAGE,
	getBreadcrumbs,
	getSlugFromParams,
	getStoryVersionFromQuery,
} from "@/utils/storyblok";
import {
	findRedirect,
	isRedirectsConfigSlug,
	REDIRECTS_CONTENT_TYPE,
} from "@/utils/storyblokRedirects";

import type { GetServerSidePropsContext, GetServerSideProps } from "next";

export const getBasePathFromSlugAndUrl = (
	resolvedUrl: string,
	slug: string | undefined
): string => {
	const raw = resolvedUrl.split("?")[0].replace(/\/+$/, ""); // strip trailing slashes

	if (!slug) return raw.replace(/^\/|\/$/g, "");

	const slugParts = slug.split("/");
	const basePathParts = raw.split("/").slice(0, -slugParts.length);
	return basePathParts.join("/").replace(/^\/|\/$/g, "");
};

export const getCorporateContentGssp = <
	T extends Record<string, unknown> = Record<string, unknown>
>(
	templateId = "static-route-catch-all"
): GetServerSideProps<T> => {
	return async function (context: GetServerSidePropsContext) {
		const { query, params, res, resolvedUrl } = context;

		const rawSlug = getSlugFromParams(params?.slug);
		const basePath = getBasePathFromSlugAndUrl(resolvedUrl, rawSlug);

		let slug = rawSlug;

		if (basePath) {
			slug = rawSlug ? `${basePath}/${rawSlug}` : basePath;
		}

		// The self-serve redirect list is a Storyblok story but never a public page
		if (!slug || isRedirectsConfigSlug(slug)) {
			return {
				notFound: true,
			};
		}

		try {
			const version = getStoryVersionFromQuery(query);

			const [storyResult, breadcrumbs] = await Promise.all([
				fetchStory<
					CategoryNavigationStoryblok | InfoPageStoryblok | TracPageStoryblok
				>(slug, version),
				getBreadcrumbs(slug, version),
			]);

			// will return a 404 if the story is not found
			if ("notFound" in storyResult && storyResult.notFound) {
				logger.error(
					`Story not found for slug: ${slug} in getCorporateContentGssp [[...slug]] catch all at ${resolvedUrl}`
				);

				// Before giving up, see if the web team have set up a redirect for this URL
				const destination = await findRedirect(`/${slug}`, version);

				if (destination) {
					// Temporary and not cached, so that a mistake is easy to undo
					res.setHeader("Cache-Control", "no-store");
					return { redirect: { destination, permanent: false } };
				}

				return { notFound: true };
			}

			if (
				(storyResult.story?.content?.component as string) ===
				REDIRECTS_CONTENT_TYPE
			) {
				return { notFound: true };
			}

			const parentID = storyResult.story?.parent_id as number;
			const isRootPage = storyResult.story?.is_startpage;

			const component = storyResult.story?.content?.component;
			let tree: ExtendedSBLink[] = [];

			if (
				component === "infoPage" &&
				storyResult.story?.content.hideSectionNav !== "true" &&
				parentID !== null
			) {
				tree = await buildTree(parentID, slug, isRootPage);
				// TODO: move out of catchall page; would need API route as GSSP is not allowed in components whilst using pages router
			}

			res.setHeader(
				"X-Page-Template-ID",
				component
					? `component: ${component}, template: ${templateId}`
					: `slug: ${slug}, template: ${templateId}`
			);

			const result = {
				props: {
					...storyResult,
					breadcrumbs,
					component,
					tree,
					slug,
				} as unknown as T,
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
				} as unknown as T,
			};
		}
	};
};
