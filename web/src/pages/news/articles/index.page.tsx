import { type ISbStories, type ISbStory } from "@storyblok/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { SimplePagination } from "@nice-digital/nds-simple-pagination";

import { Link } from "@/components/Link/Link";
import { logger } from "@/logger";
import { fetchStories, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlesProps = {
	stories: ISbStories[];
	totalPages: number;
	currentPage: number;
};

export const ArticlesIndexPage = ({
	stories,
	totalPages,
	currentPage,
}: NewsArticlesProps): React.ReactElement => {
	const router = useRouter();

	return (
		<>
			<h1>Articles Index Page</h1>
			{stories.map((story, index) => {
				return <p key={`${story.name}_${index}`}>{story.name}</p>;
			})}

			<SimplePagination
				totalPages={totalPages}
				currentPage={currentPage}
				nextPageLink={{
					destination: `${router.pathname}?page=${currentPage + 1}`,
					elementType: Link,
				}}
				previousPageLink={{
					destination: `${router.pathname}?page=${currentPage - 1}`,
					elementType: Link,
				}}
			/>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	logger.warn("Start server side props for /news/articles list page");

	const version = getStoryVersionFromQuery(context.query);
	const page = context.query.page
		? parseInt(context.query.page as string, 10)
		: 1;
	const resultsPerPage = 5;

	const storiesResult = await fetchStories(version, {
		starts_with: "news/articles/",
		per_page: resultsPerPage,
		page,
	});

	const totalPages = storiesResult.total / resultsPerPage;

	// console.log("****************** Stories result:", storiesResult);

	//TODO handle empty list
	// if (storiesResult.stories.length == 0) return { notFound: true };

	logger.warn("Finish server side props for news articles list page");

	const result = {
		props: {
			stories: [...storiesResult.stories],
			totalPages,
			currentPage: page,
		},
	};
	return result;
}

export default ArticlesIndexPage;
