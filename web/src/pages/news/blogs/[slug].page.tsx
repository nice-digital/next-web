import { StoryblokComponent, setComponents } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { type StoryblokStory } from "storyblok-generate-ts";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { StoryblokBlogPost } from "@/components/Storyblok/StoryblokBlogPost/StoryblokBlogPost";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { logger } from "@/logger";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { BlogPostStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	GENERIC_ERROR_MESSAGE,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type BlogPageErrorProps = {
	error: string;
};

export type BlogPageSuccessProps = {
	story: StoryblokStory<BlogPostStoryblok>;
	breadcrumbs?: Breadcrumb[];
};

export type BlogPageProps = BlogPageSuccessProps | BlogPageErrorProps;

export default function BlogPostPage(props: BlogPageProps): React.ReactElement {
	setComponents({
		blogPost: StoryblokBlogPost,
		quote: Blockquote,
		youtubeEmbed: StoryblokYoutubeEmbed,
		iframe: StoryblokIframe,
		metadata: Metadata,
	});
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

	const slug = getSlugFromParams(params?.slug);

	if (!slug) {
		return {
			notFound: true,
		};
	}

	const version = getStoryVersionFromQuery(query);

	logger.info("Fetching blog post from storyblok at path", params?.slug);

	try {
		// Resolve slug from params

		// Get the story and its breadcrumbs
		const storyResult = await fetchStory<BlogPostStoryblok>(
			`news/blogs/${slug}`,
			version,
			{ resolve_relations: "blogPost.author" }
		);

		logger.info(
			{
				data: storyResult,
				requestHeaders: context.req.headers,
			},
			`Fetched blog post from storyblok at path: ${slug}`
		);

		if ("notFound" in storyResult) {
			return {
				notFound: true,
			};
		}

		const breadcrumbs = [
			{ title: "News", path: "/news" },
			{ title: "Blogs", path: "/news/blogs" },
		];

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} catch (error) {
		logger.error(
			{
				"Cache-Control-Request": context.req.headers["cache-control"],
				errorCause: error instanceof Error && error.cause,
				requestHeaders: context.req.headers,
			},
			`Error fetching blog post at path ${slug} from gssp`
		);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
