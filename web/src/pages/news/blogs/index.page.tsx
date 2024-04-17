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
import { NewsListPaginationAnnouncer } from "@/components/Storyblok/News/NewsListPaginationAnnouncer/NewsListPaginationAnnouncer";
import { PaginationFocusedElement } from "@/components/Storyblok/News/NewsListPaginationFocus/NewsListPaginationFocus";
import { NewsStory } from "@/types/News";
import { isError, validateRouteParams } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

export type BlogPostsErrorProps = {
	error: string;
};

export type BlogPostsSuccessProps = {
	featuredStory?: StoryblokStory<NewsStory> | null;
	stories: StoryblokStory<NewsStory>[];
	total: number;
	currentPage: number;
	perPage: number;
};

export type BlogPostsProps = BlogPostsSuccessProps | BlogPostsErrorProps;

export const BlogIndexPage = (props: BlogPostsProps): React.ReactElement => {
	if ("error" in props) {
		const { error } = props;
		return <ErrorPageContent title="Error" heading={error} />;
	}

	const { featuredStory, stories, total, currentPage, perPage } = props;

	const pageTitle = "Blogs";

	return (
		<>
			<NextSeo title={pageTitle} openGraph={{ title: pageTitle }}></NextSeo>
			<PageHeader
				id="content-start"
				heading={pageTitle}
				variant="fullWidthDark"
				breadcrumbs={
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/news">News</Breadcrumb>
						<Breadcrumb>Blogs</Breadcrumb>
					</Breadcrumbs>
				}
			/>
			<NewsListNav />
			{stories.length === 0 ? (
				<p>Sorry there are no blog posts available</p>
			) : (
				<>
					<NewsListPaginationAnnouncer
						currentPage={currentPage}
						total={total}
						perPage={perPage}
						announcementPrefix="Blog post listing page"
					/>
					<PaginationFocusedElement innerText="Blog post list" />

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
	try {
		const result = await validateRouteParams<BlogPostsProps>({
			query,
			sbParams: {
				starts_with: "news/blogs/",
				per_page: 6,
				resolve_relations: "blogPost.author",
			},
			resolvedUrl,
		});

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

export default BlogIndexPage;
