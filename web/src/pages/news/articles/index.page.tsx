import { ISbStoryData } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React from "react";

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
import { logger } from "@/logger";
import { NewsStory } from "@/types/News";
import { GENERIC_ERROR_MESSAGE, validateRouteParams } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type NewsArticleErrorProps = {
	error: string;
};

export type NewsArticlesSuccessProps = {
	featuredStory?: ISbStoryData<NewsStory> | null;
	stories: ISbStoryData<NewsStory>[];
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
				verticalPadding="loose"
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

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const { query } = context;
	try {
		const result = await validateRouteParams<NewsArticlesProps>({
			query,
			sbParams: {
				starts_with: "news/articles/",
				per_page: 6,
			},
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
		// {
		// 	errorCause: error instanceof Error && error.cause,
		// 	requestHeaders: context.req.headers,
		// },
		logger.error(
			`Error fetching news article listing at page ${query.page || 1} from gssp`
		);

		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
};

export default ArticlesIndexPage;
