import { type ISbStories } from "@storyblok/react";
import React from "react";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Button } from "@nice-digital/nds-button";

import { NewsListPagination } from "@/components/Storyblok/NewsListPagination/NewsListPagination";
import { logger } from "@/logger";
import { fetchStories, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlesProps = {
	stories: ISbStories[];
	totalResults: number;
	currentPage: number;
	resultsPerPage: number;
};

export const ArticlesIndexPage = ({
	stories,
	currentPage,
	totalResults,
	resultsPerPage,
}: NewsArticlesProps): React.ReactElement => {
	return (
		<>
			<h1>Articles Index Page</h1>
			{stories.map((story, index) => {
				return <p key={`${story.name}_${index}`}>{story.name}</p>;
			})}
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
	const resultsPerPage = 10;

	const storiesResult = await fetchStories(version, {
		starts_with: "news/articles/",
		per_page: resultsPerPage,
		page,
	});

	logger.info("Finish server side props for news articles list page");

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
					stories: storiesResult.stories,
					totalResults: storiesResult.total,
					currentPage: page,
					resultsPerPage,
				},
		  };
}

export default ArticlesIndexPage;
