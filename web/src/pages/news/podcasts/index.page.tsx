import { ISbStoryData } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Panel } from "@nice-digital/nds-panel";

import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { NewsList } from "@/components/Storyblok/News/NewsList/NewsList";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import { NewsListPagination } from "@/components/Storyblok/News/NewsListPagination/NewsListPagination";
import { NewsListPaginationAnnouncer } from "@/components/Storyblok/News/NewsListPaginationAnnouncer/NewsListPaginationAnnouncer";
import { PaginationFocusedElement } from "@/components/Storyblok/News/NewsListPaginationFocus/NewsListPaginationFocus";
import { logger } from "@/logger";
import { NewsStory } from "@/types/News";
import { GENERIC_ERROR_MESSAGE, validateRouteParams } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type PodcastPostsErrorProps = {
	error: string;
};

export type PodcastPostsSuccessProps = {
	stories: ISbStoryData<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
};

export type PodcastPostsProps =
	| PodcastPostsSuccessProps
	| PodcastPostsErrorProps;

export const PodcastIndexPage = (
	props: PodcastPostsProps
): React.ReactElement => {
	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { stories, total, currentPage, perPage } = props;

	return (
		<>
			<NextSeo title="Podcasts" openGraph={{ title: "Podcasts" }}></NextSeo>
			<PageHeader
				id="content-start"
				heading="Podcasts"
				variant="fullWidthDark"
				lead="Our NICE talks podcasts bring you the real life experiences of people working within the NHS, public health and social care."
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/news">News</Breadcrumb>
						<Breadcrumb>Podcasts</Breadcrumb>
					</Breadcrumbs>
				}
				verticalPadding="loose"
			/>
			<NewsListNav />
			{stories.length === 0 ? (
				<p>Sorry there are no podcasts available</p>
			) : (
				<Grid gutter="loose">
					<GridItem cols={12} md={{ cols: 7 }}>
						<NewsListPaginationAnnouncer
							currentPage={currentPage}
							total={total}
							perPage={perPage}
							announcementPrefix="Podcast listing page"
						/>
						<PaginationFocusedElement innerText="Podcast list" />
						<NewsList news={stories} showImage={false} />
					</GridItem>
					<GridItem cols={12} md={{ cols: 4, push: 1 }}>
						<Panel>
							<h2 className="h3">Other ways to listen</h2>
							<p>
								Our NICE talks podcasts are available{" "}
								<a href="https://linktr.ee/nicetalks">
									on a variety of different platforms.
								</a>
							</p>
						</Panel>
					</GridItem>
				</Grid>
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
		const result = await validateRouteParams<PodcastPostsProps>({
			query,
			sbParams: {
				starts_with: "news/podcasts/",
				per_page: 6,
			},
		});

		if ("notFound" in result || "redirect" in result) return result;

		const { featuredStory, stories, total, perPage, currentPage } = result;

		/* because there's no featuredStory in podcasts we need to include the returned featuredStory in the stories array on page 1 */
		const podcastStories =
			currentPage === 1 ? [featuredStory, ...stories] : stories;

		return {
			props: {
				stories: podcastStories,
				total,
				currentPage,
				perPage,
			},
		};
	} catch (error) {
		logger.error(
			{
				errorCause: error instanceof Error && error.cause,
				requestHeaders: context.req.headers,
			},
			`Error fetching podcast listing at page ${query.page || 1} from gssp`
		);
		return {
			props: {
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
};

export default PodcastIndexPage;
