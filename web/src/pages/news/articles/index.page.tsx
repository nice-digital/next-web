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
import { NewsStory } from "@/types/News";
import { validateRouteParams } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type NewsArticlesProps = {
	featuredStory?: StoryblokStory<NewsStory> | null;
	stories: StoryblokStory<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
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
	total,
	perPage,
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

			{stories.length === 0 ? (
				<p>Sorry there are no news articles available</p>
			) : (
				<>
					{featuredStory && <FeaturedStory story={featuredStory} />}
					<NewsList news={stories} />
				</>
			)}

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
					total,
					perPage,
				}}
			/>
		</>
	);
};

export const getServerSideProps = async ({
	query,
	resolvedUrl,
}: GetServerSidePropsContext) => {
	const result = await validateRouteParams<NewsArticlesProps>({
		query,
		sbParams: {
			starts_with: "news/articles/",
			per_page: 6,
		},
		resolvedUrl,
	});

	// will return a 404 or redirect if the route is not valid
	if ("notFound" in result || "redirect" in result) return result;

	//
	if ("error" in result) {
		return {
			props: {
				...result,
			},
		};
	}

	const { featuredStory, stories, total, perPage, currentPage } = result;

	return {
		props: {
			featuredStory,
			stories,
			total,
			currentPage,
			perPage,
		},
	};
};

export default ArticlesIndexPage;
