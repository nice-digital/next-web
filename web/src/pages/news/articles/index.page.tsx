import { NextSeo } from "next-seo";
import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Button } from "@nice-digital/nds-button";
import { PageHeader } from "@nice-digital/nds-page-header";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsList } from "@/components/Storyblok/News/NewsList/NewsList";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import { NewsListPagination } from "@/components/Storyblok/News/NewsListPagination/NewsListPagination";
import { logger } from "@/logger";
import { NewsStory } from "@/types/News";
import { fetchStories, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type NewsArticlesProps = {
	featuredStory?: StoryblokStory<NewsStory> | null;
	stories: StoryblokStory<NewsStory>[];
	totalResults: number;
	currentPage: number;
	resultsPerPage: number;
	error?: string | undefined;
};

const destinations = [
	{ url: "/news/", title: "News" },
	{ url: "/news/articles", title: "News articles" },
	{ url: "/news/in-depth", title: "In-depth" },
	{ url: "/news/blogs", title: "Blogs" },
	{ url: "/news/podcasts", title: "Podcasts" },
];

export const ArticlesIndexPage = ({
	stories,
	currentPage,
	totalResults,
	resultsPerPage,
	featuredStory,
	error,
}: NewsArticlesProps): React.ReactElement => {
	if (error) {
		return <ErrorPageContent title="Error" heading={error} />;
	}
	return (
		<>
			<NextSeo
				title="News Articles"
				openGraph={{ title: "News Articles" }}
			></NextSeo>
			<PageHeader
				heading="News articles"
				variant="fullWidthDark"
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="https://www.nice.org.uk/">Home</Breadcrumb>
						<Breadcrumb to="https://www.nice.org.uk/news">News</Breadcrumb>
						<Breadcrumb>Articles</Breadcrumb>
					</Breadcrumbs>
				}
			/>
			<NewsListNav destinations={destinations} />
			{featuredStory && <FeaturedStory story={featuredStory} />}
			<NewsList news={stories} />
			<ActionBanner
				title="Sign up for our newsletters and alerts"
				cta={
					<Button variant="cta" to="/news/nice-newsletters-and-alerts">
						Sign up for newsletters and alerts
					</Button>
				}
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
	const version = getStoryVersionFromQuery(query);
	const page = Number(query.page) || 1;
	const resultsPerPage = 6;

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

	if (!storiesResult || storiesResult.total === undefined) {
		logger.error("Error fetching stories: ", storiesResult);
		return {
			props: {
				error: "Error fetching stories",
			},
		};
	}

	let stories = storiesResult.stories;
	let featuredStory = null;

	if (
		page === 1 &&
		stories.length > 0 &&
		stories[0].uuid === latestStoryResult.stories[0].uuid // Check if the first story on page 1 is the same as the latest story
	) {
		featuredStory = latestStoryResult.stories[0]; // Set featured story on page 1
		stories = stories.slice(1); // Skip first story on page 1 as it's featured
	}

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
					featuredStory,
					stories,
					totalResults: storiesResult.total,
					currentPage: page,
					resultsPerPage,
				},
		  };
}

export default ArticlesIndexPage;
