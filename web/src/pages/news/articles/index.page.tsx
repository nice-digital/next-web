import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Button } from "@nice-digital/nds-button";

import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsList } from "@/components/Storyblok/News/NewsList/NewsList";
import { NewsListPagination } from "@/components/Storyblok/NewsListPagination/NewsListPagination";
import { logger } from "@/logger";
import { NewsStory } from "@/types/News";
import { fetchStories, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlesProps = {
	featuredStory: StoryblokStory<NewsStory>;
	stories: StoryblokStory<NewsStory>[];
	totalResults: number;
	currentPage: number;
	resultsPerPage: number;
};

export const ArticlesIndexPage = ({
	stories,
	currentPage,
	totalResults,
	resultsPerPage,
	featuredStory,
}: NewsArticlesProps): React.ReactElement => {
	return (
		<>
			<h1>Articles Index Page</h1>
			<FeaturedStory story={featuredStory} />
			<NewsList news={stories} />
			<ActionBanner
				title="Sign up for our newsletters and alerts"
				cta={<Button variant="cta">Sign up for newsletters and alerts</Button>}
			>
				Keeping you up to date with important developments at NICE
			</ActionBanner>
			<NewsListPagination
				configuration={{
					currentPage,
					totalResults,
					resultsPerPage,
				}}
			/>
		</>
	);
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	logger.info("Start server side props for /news/articles list page");

	const version = getStoryVersionFromQuery(query);
	const page = Number(query.page) || 1;
	const resultsPerPage = 5;

	const storiesResult = await fetchStories(version, {
		starts_with: "news/articles/",
		per_page: resultsPerPage,
		page,
		sort_by: "content.date:desc",
	});

	const latestStoryResult = await fetchStories(version, {
		starts_with: "news/articles/",
		per_page: 1,
		page: 1,
		sort_by: "content.date:desc",
	});

	logger.info("Finish server side props for news articles list page");

	if (!storiesResult || storiesResult.total === undefined) {
		logger.error("Failed to fetch stories");
		return { notFound: true };
	}

	//TODO ternary redirect for invalid page is probably better handled elsewhere
	return page < 1 ||
		page > Math.ceil(storiesResult.total / resultsPerPage) ||
		isNaN(page)
		? {
				redirect: {
					destination: "/news/articles",
					permanent: false,
				},
		  }
		: {
				props: {
					featuredStory: latestStoryResult.stories[0],
					stories: storiesResult.stories,
					totalResults: storiesResult.total,
					currentPage: page,
					resultsPerPage,
				},
		  };
}

export default ArticlesIndexPage;
