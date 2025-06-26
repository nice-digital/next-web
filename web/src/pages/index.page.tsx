import {
	type ISbStoryData,
	type ISbStoriesParams,
	StoryblokComponent,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
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
	story: ISbStoryData<HomepageStoryblok>;
	latestNews: ISbStoryData<NewsStory>[];
};

export type HomePageProps = HomePageErrorProps | HomePageSuccessProps;

export default function Home(props: HomePageProps): React.ReactElement {
	const story = "story" in props ? props.story : null;

	const additionalMetaTags = useMemo(() => {
		if (story) {
			return getAdditionalMetaTags(story);
		} else {
			//TODO this needs moving to the function as it is generating a lot of noise
			// logger.error(
			// 	`Story is not available for additionalMetaTags in HomePage.`
			// );
			return undefined;
		}
	}, [story]);

	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

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
			.featuredStory as ISbStoryData<NewsArticleStoryblok>;
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
		// {
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(`Error fetching Homepage from gssp`);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
}
