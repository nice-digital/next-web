import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { NewsArticleStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	getBreadcrumbs,
	GENERIC_ERROR_MESSAGE,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlePageErrorProps = {
	error: string;
};

type NewsArticlePageSuccessProps = {
	story: ISbStoryData<NewsArticleStoryblok>;
	breadcrumbs?: Breadcrumb[];
};

type NewsArticlePageProps =
	| NewsArticlePageSuccessProps
	| NewsArticlePageErrorProps;

export default function NewsArticlePage(
	props: NewsArticlePageProps
): React.ReactElement {
	// story for meta tags, allows for additionalMetaTags to be fetched in useMemo
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			logger.error(
				`Story is not available for additionalMetaTags in NewsArticlePage.`
			);
			return undefined;
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	// reassigning story to avoid TS error
	const { story: storyData, breadcrumbs } = props;

	const title = storyData.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent blok={storyData.content} breadcrumbs={breadcrumbs} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;

	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);

	if (!slug) {
		return {
			notFound: true,
		};
	}

	const version = getStoryVersionFromQuery(query);

	logger.info("Fetching news article from storyblok at path", params?.slug);

	try {
		const pagePath = `news/articles/${slug}`;

		// Get the story and its breadcrumbs
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory<NewsArticleStoryblok>(pagePath, version),
			getBreadcrumbs(pagePath, version),
		]);

		logger.info(
			{
				data: storyResult,
				requestHeaders: context.req.headers,
			},
			`Fetched news article from storyblok at path: ${slug}`
		);

		if ("notFound" in storyResult) {
			return {
				notFound: true,
			};
		}

		// update breadcrumbs Articles name to be News Articles
		const renamedBreadcrumbs = breadcrumbs.map((breadcrumb) => {
			if (breadcrumb.title === "Articles") {
				breadcrumb.title = "News articles";
			}
			return breadcrumb;
		});

		const result = {
			props: {
				...storyResult,
				breadcrumbs: renamedBreadcrumbs,
			},
		};

		return result;
	} catch (error) {
		// {
		// 	"Cache-Control-Request": context.req.headers["cache-control"],
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(`Error fetching news article at path ${slug} from gssp`);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
