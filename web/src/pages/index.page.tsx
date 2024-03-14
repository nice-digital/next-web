import { type ISbStoriesParams, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { type NewsStory } from "@/types/News";
import {
	type HomepageStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	fetchStories,
	getStoryVersionFromQuery,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export interface HomeProps {
	story: StoryblokStory<HomepageStoryblok>;
	latestNews: StoryblokStory<NewsStory>[];
}

export default function Home({
	story,
	latestNews,
}: HomeProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	return (
		<>
			<NextSeo
				title="Homepage"
				openGraph={{ title: "Homepage" }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent blok={story.content} latestNews={latestNews} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const slug = "home";
	const version = getStoryVersionFromQuery(context.query);
	const storyResult = await fetchStory<HomepageStoryblok>(slug, version, {
		resolve_links: "url",
		resolve_relations: "homepage.featuredStory,spotlight.stories",
	});

	// Fetch latest news stories
	const latestNewsParams: ISbStoriesParams = {
		starts_with: "news",
		sort_by: "content.date:desc",
		excluding_slugs: "news/blogs/authors/*",
		per_page: 3,
	};

	// Check if we've got a featured story - if so, we need to exclude it
	const featuredStory = storyResult.story?.content
		.featuredStory as StoryblokStory<NewsArticleStoryblok>;
	if (featuredStory.id) {
		latestNewsParams.excluding_ids = featuredStory.id.toString();
	}

	const latestNews = await fetchStories<NewsStory>(
		"published",
		latestNewsParams
	);

	const result = {
		props: {
			...storyResult,
			latestNews: latestNews.stories,
		},
	};
	return result;
}
