import { isError } from "lodash";
import { NextSeo } from "next-seo";
import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsList } from "@/components/Storyblok/News/NewsList/NewsList";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import { NewsListPagination } from "@/components/Storyblok/News/NewsListPagination/NewsListPagination";
import { NewsListPaginationAnnouncer } from "@/components/Storyblok/News/NewsListPaginationAnnouncer/NewsListPaginationAnnouncer";
import { PaginationFocusedElement } from "@/components/Storyblok/News/NewsListPaginationFocus/NewsListPaginationFocus";
import { NewsStory } from "@/types/News";
import { initStoryblok } from "@/utils/initStoryblok";
import {
	getStoryVersionFromQuery,
	validateRouteParams,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type NewsArticleErrorProps = {
	error: string;
};

export type NewsArticlesSuccessProps = {
	featuredStory?: StoryblokStory<NewsStory> | null;
	stories: StoryblokStory<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
};

export type NewsArticlesProps =
	| NewsArticlesSuccessProps
	| NewsArticleErrorProps;

export const ArticlesIndexPage = (
	props: NewsArticlesProps
): React.ReactElement => {
	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { featuredStory, stories, total, currentPage, perPage } = props;
	return (
		<>
			<NextSeo
				title="News Articles"
				openGraph={{ title: "News Articles" }}
			></NextSeo>
			<PageHeader
				id="content-start"
				heading="News articles"
				variant="fullWidthDark"
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/news">News</Breadcrumb>
						<Breadcrumb>Articles</Breadcrumb>
					</Breadcrumbs>
				}
			/>
			<NewsListNav />
			{stories.length === 0 ? (
				<p>Sorry there are no news articles available</p>
			) : (
				<>
					<NewsListPaginationAnnouncer
						currentPage={currentPage}
						total={total}
						perPage={perPage}
						announcementPrefix="News article listing page"
					/>
					<PaginationFocusedElement innerText="News article list" />
					{featuredStory && <FeaturedStory story={featuredStory} />}
					<NewsList news={stories} />
				</>
			)}
			<NewsLetterSignup />
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
}: GetServerSidePropsContext) => {
	const version = getStoryVersionFromQuery(query);

	try {
		initStoryblok(version);
	} catch (error) {
		return {
			props: {
				error:
					"Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		};
	}

	try {
		const result = await validateRouteParams<NewsArticlesProps>({
			query,
			sbParams: {
				starts_with: "news/articles/",
				per_page: 6,
			},
			version,
		});

		// will return a 404 or redirect if the route is not valid
		if ("notFound" in result || "redirect" in result) return result;

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
	} catch (error) {
		return {
			props: {
				error: isError(error)
					? error.message
					: "Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		};
	}
};

export default ArticlesIndexPage;
