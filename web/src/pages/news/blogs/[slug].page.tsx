import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { BlogPostStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	GENERIC_ERROR_MESSAGE,
	getBreadcrumbs,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type BlogPageErrorProps = {
	error: string;
};

export type BlogPageSuccessProps = {
	story: ISbStoryData<BlogPostStoryblok>;
	breadcrumbs?: Breadcrumb[];
};

export type BlogPageProps = BlogPageSuccessProps | BlogPageErrorProps;

export default function BlogPostPage(props: BlogPageProps): React.ReactElement {
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			logger.error(
				`Story is not available for additionalMetaTags in BlogPostPage.`
			);
			return undefined;
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

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
	const pagePath = `news/blogs/${slug}`;

	logger.info("Fetching blog post from storyblok at path", pagePath);

	try {
		// Get the story and its breadcrumbs
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory<BlogPostStoryblok>(pagePath, version, {
				resolve_relations: "blogPost.author",
			}),
			getBreadcrumbs(pagePath, version),
		]);

		logger.info(
			{
				data: storyResult,
				requestHeaders: context.req.headers,
			},
			`Fetched blog post from storyblok at path: ${pagePath}`
		);

		if ("notFound" in storyResult) {
			return {
				notFound: true,
			};
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} catch (error) {
		// {
		// 	"Cache-Control-Request": context.req.headers["cache-control"],
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(`Error fetching blog post at path ${slug} from gssp`);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
