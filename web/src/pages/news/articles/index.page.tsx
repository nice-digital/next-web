import { type ISbStories, type ISbStory } from "@storyblok/react";
import React from "react";

import { SimplePagination } from "@nice-digital/nds-simple-pagination";

import { logger } from "@/logger";
import { fetchStories, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

type NewsArticlesProps = {
	stories: ISbStories[];
};

export const ArticlesIndexPage = ({
	stories,
}: NewsArticlesProps): React.ReactElement => {
	console.log({ stories });
	return (
		<>
			<h1>Articles Index Page</h1>
			{stories.map((story, index) => {
				return <p key={`${story.name}_${index}`}>{story.name}</p>;
			})}

			<SimplePagination
				totalPages={7}
				currentPage={2}
				nextPageLink={{ destination: "#", elementType: "a" }}
				previousPageLink={{ destination: "#", elementType: "a" }}
			/>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	logger.warn("Start server side props for /news/articles list page");

	const version = getStoryVersionFromQuery(context.query);

	const storiesResult = await fetchStories(version, {
		starts_with: "news/articles/",
		per_page: 5,
	});

	console.log("****************** Stories result:", storiesResult);

	//TODO handle empty list
	if (storiesResult.length == 0) return { notFound: true };

	logger.warn("Finish server side props for news articles list page");

	const result = {
		props: {
			stories: [...storiesResult],
		},
	};
	return result;
}

export default ArticlesIndexPage;
