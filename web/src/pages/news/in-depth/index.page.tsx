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

export type InDepthArticleErrorProps = {
	error: string;
};

export type InDepthArticleSuccessProps = {
	featuredStory?: ISbStoryData<NewsStory> | null;
	stories: ISbStoryData<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
};

export type InDepthArticleProps =
	| InDepthArticleSuccessProps
	| InDepthArticleErrorProps;

export const InDepthArticleIndexPage = (
	props: InDepthArticleProps
): React.ReactElement => {
	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { stories, currentPage, total, perPage, featuredStory } = props;
	return (
		<>
			<NextSeo title="In-depth" openGraph={{ title: "In-depth" }}></NextSeo>
			<PageHeader
				id="content-start"
				heading="In-depth"
				variant="fullWidthDark"
				lead="Our in-depth articles explore how our work is making a real difference to people's lives."
				description="Through this featured content, you'll learn how our guidance and advice is supporting effective decision making, for the benefit of individuals and society as a whole."
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/news">News</Breadcrumb>
						<Breadcrumb>In-depth</Breadcrumb>
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
						announcementPrefix="In-depth article listing page"
					/>
					<PaginationFocusedElement innerText="In-depth articles list" />
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
		const result = await validateRouteParams<InDepthArticleProps>({
			query,
			sbParams: {
				starts_with: "news/in-depth/",
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
			`Error fetching in-depth article listing at page ${
				query.page || 1
			} from gssp`
		);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
};

export default InDepthArticleIndexPage;
