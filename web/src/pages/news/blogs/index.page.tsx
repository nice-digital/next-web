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
import { GENERIC_ERROR_MESSAGE, validateRouteParams } from "@/utils/storyblok";

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
	try {
		const result = await validateRouteParams<BlogPostsProps>({
			query,
			sbParams: {
				starts_with: "news/blogs/",
				per_page: 6,
				resolve_relations: "blogPost.author",
			},
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
				error: GENERIC_ERROR_MESSAGE,
			},
		};
	}
};

export default BlogIndexPage;
