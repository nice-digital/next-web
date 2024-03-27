import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Panel } from "@nice-digital/nds-panel";

import { Announcer } from "@/components/Announcer/Announcer";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { NewsList } from "@/components/Storyblok/News/NewsList/NewsList";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import { NewsListPagination } from "@/components/Storyblok/News/NewsListPagination/NewsListPagination";
import { PaginationFocusedElement } from "@/components/Storyblok/News/NewsListPaginationFocus/NewsListPaginationFocus";
import { NewsStory } from "@/types/News";
import { validateRouteParams } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type PodcastPostsProps = {
	stories: StoryblokStory<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
	error?: string | undefined;
};

export const PodcastIndexPage = ({
	stories,
	currentPage,
	total,
	perPage,
	error,
}: PodcastPostsProps): React.ReactElement => {
	const [announcement, setAnnouncement] = useState("");
	const totalPages = Math.ceil(total / perPage);

	useEffect(() => {
		const announcementText = `Podcast listing page, ${currentPage} of ${totalPages}`;
		setAnnouncement(announcementText);

		return () => {
			setAnnouncement("");
		};
	}, [currentPage, totalPages]);

	if (error) {
		return <ErrorPageContent title="Error" heading={error} />;
	}
	return (
		<>
			<NextSeo title="Podcasts" openGraph={{ title: "Podcasts" }}></NextSeo>
			<PageHeader
				id="content-start"
				heading="Podcasts"
				variant="fullWidthDark"
				lead="Our NICE talks podcasts bring you the real life experience of people working within NHS, public health and social care."
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/news">News</Breadcrumb>
						<Breadcrumb>Podcasts</Breadcrumb>
					</Breadcrumbs>
				}
			/>
			<NewsListNav />
			<Grid gutter="loose">
				<GridItem cols={12} md={{ cols: 7 }}>
					<Announcer announcement={announcement} />
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
	const result = await validateRouteParams<PodcastPostsProps>({
		query,
		sbParams: {
			starts_with: "news/podcasts/",
			per_page: 3,
		},
		resolvedUrl,
	});

	if ("notFound" in result || "redirect" in result) return result;

	if ("error" in result) {
		return {
			props: {
				...result,
			},
		};
	}

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
};

export default PodcastIndexPage;
