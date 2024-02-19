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
				nextPageLink={
					currentPage < totalPages
						? {
								destination: `${router.pathname}?page=${currentPage + 1}`,
								elementType: Link,
						  }
						: undefined
				}
				previousPageLink={
					currentPage > 1
						? {
								destination: `${router.pathname}?page=${currentPage - 1}`,
								elementType: Link,
						  }
						: undefined
				}
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

	const totalPages = Math.ceil(storiesResult.total / resultsPerPage);

	if (page < 1 || page > totalPages || isNaN(page)) {
		return {
			redirect: {
				destination: "/news/articles",
				permanent: false,
			},
		};
	}

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
