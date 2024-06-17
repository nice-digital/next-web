import {
	type ISbStoriesParams,
	StoryblokComponent,
	setComponents,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { Homepage } from "@/components/Storyblok/Homepage/Homepage";
import { HomepageHero } from "@/components/Storyblok/Homepage/HomepageHero/HomepageHero";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { NestedRichText } from "@/components/Storyblok/NestedRichText/NestedRichText";
import { PromoBox } from "@/components/Storyblok/PromoBox/PromoBox";
import { Spotlight } from "@/components/Storyblok/Spotlight/Spotlight";
import { StoryblokActionBanner } from "@/components/Storyblok/StoryblokActionBanner/StoryblokActionBanner";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { logger } from "@/logger";
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
	GENERIC_ERROR_MESSAGE,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type HomePageErrorProps = {
	error: string;
};

export type HomePageSuccessProps = {
	story: StoryblokStory<HomepageStoryblok>;
	latestNews: StoryblokStory<NewsStory>[];
};

export type HomePageProps = HomePageErrorProps | HomePageSuccessProps;

export default function Home(props: HomePageProps): React.ReactElement {
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

	setComponents({
		actionBanner: StoryblokActionBanner,
		hero: StoryblokHero,
		homepage: Homepage,
		homepageHero: HomepageHero,
		metadata: Metadata,
		nestedRichText: NestedRichText,
		promoBox: PromoBox,
		spotlight: Spotlight,
		cardGrid: CardGrid,
	});

	const { story: storyData, latestNews } = props;

	return (
		<>
			<NextSeo
				title="Homepage"
				openGraph={{ title: "Homepage" }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent blok={storyData.content} latestNews={latestNews} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const slug = "home";
	const version = getStoryVersionFromQuery(context.query);

	try {
		const storyResult = await fetchStory<HomepageStoryblok>(slug, version, {
			resolve_links: "url",
			resolve_relations:
				"homepage.featuredStory,homepage.featuredStory,blogPost.author,spotlight.stories",
		});

		// Fetch latest news stories
		const latestNewsParams: ISbStoriesParams = {
			starts_with: "news",
			sort_by: "content.date:desc",
			excluding_slugs: "news/blogs/authors/*",
			resolve_relations: "blogPost.author",
			per_page: 3,
			filter_query: {
				date: {
					lt_date: new Date().toISOString(),
				},
			},
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
	} catch (error) {
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
