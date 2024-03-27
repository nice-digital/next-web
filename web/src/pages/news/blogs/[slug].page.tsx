import {
	type ISbStoryData,
	StoryblokComponent,
	setComponents,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { StoryblokBlogPost } from "@/components/Storyblok/StoryblokBlogPost/StoryblokBlogPost";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { BlogPostStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface BlogPageProps {
	story: ISbStoryData<BlogPostStoryblok>;
	breadcrumbs?: Breadcrumb[];
}

export default function BlogPostPage({
	story,
	breadcrumbs,
}: BlogPageProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	setComponents({
		blogPost: StoryblokBlogPost,
		quote: Blockquote,
		youtubeEmbed: StoryblokYoutubeEmbed,
		iframe: StoryblokIframe,
	});

	const title = story.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent blok={story.content} breadcrumbs={breadcrumbs} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;
	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);

	if (slug) {
		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const storyResult = await fetchStory<BlogPostStoryblok>(
			`news/blogs/${slug}`,
			version,
			{ resolve_relations: "blogPost.author" }
		);

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
	} else {
		return {
			notFound: true,
		};
	}
}
