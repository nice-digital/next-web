import {
	type ISbStoryData,
	StoryblokComponent,
	setComponents,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokNewsArticle } from "@/components/Storyblok/StoryblokNewsArticle/StoryblokNewsArticle";
import { StoryblokRelatedLink } from "@/components/Storyblok/StoryblokRelatedLink/StoryblokRelatedLink";
import { StoryblokRelatedNewsLink } from "@/components/Storyblok/StoryblokRelatedNewsLink/StoryblokRelatedNewsLink";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { type Breadcrumb } from "@/types/Breadcrumb";
import { NewsArticleStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface NewsArticlePageProps {
	story: ISbStoryData<NewsArticleStoryblok>;
	breadcrumbs?: Breadcrumb[];
}

export default function NewsArticlePage({
	story,
	breadcrumbs,
}: NewsArticlePageProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	setComponents({
		newsArticle: StoryblokNewsArticle,
		quote: Blockquote,
		relatedLink: StoryblokRelatedLink,
		relatedNewsLink: StoryblokRelatedNewsLink,
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
		const storyResult = await fetchStory(`news/articles/${slug}`, version);

		const breadcrumbs = [
			{ title: "News", path: "/news" },
			{ title: "News articles", path: "/news/articles" },
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
