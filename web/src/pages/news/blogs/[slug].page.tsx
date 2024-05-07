import { StoryblokComponent, setComponents } from "@storyblok/react";
import { isError } from "lodash";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { type StoryblokStory } from "storyblok-generate-ts";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
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

//TODO check if moving this out of the component improves performance. Or, should this be in the component function and wrapped in a useMemo/useCallback?
setComponents({
	blogPost: StoryblokBlogPost,
	quote: Blockquote,
	youtubeEmbed: StoryblokYoutubeEmbed,
	iframe: StoryblokIframe,
});

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
	try {
		// Resolve slug from params
		const slug = getSlugFromParams(params?.slug);

		if (!slug) {
			return {
				notFound: true,
			};
		}

		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const storyResult = await fetchStory<BlogPostStoryblok>(
			`news/blogs/${slug}`,
			version,
			{ resolve_relations: "blogPost.author" }
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

		return {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};
	} catch (error) {
		return {
			props: {
				error: isError(error)
					? error.message
					: "Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		};
	}
}
