import { ISbStoriesParams } from "@storyblok/react";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Link } from "@/components/Link/Link";
import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsGrid } from "@/components/Storyblok/News/NewsGrid/NewsGrid";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import {
	BlogPostStoryblok,
	InDepthArticleStoryblok,
	NewsArticleStoryblok,
	PodcastStoryblok,
} from "@/types/storyblok";
import { getStoryVersionFromQuery, fetchStories } from "@/utils/storyblok";

interface NewsIndexProps {
	newsArticles: StoryblokStory<NewsArticleStoryblok>[];
	inDepthArticles: StoryblokStory<InDepthArticleStoryblok>[];
	blogPosts: StoryblokStory<BlogPostStoryblok>[];
	podcasts: StoryblokStory<PodcastStoryblok>[];
}

export default function NewsIndexPage({
	newsArticles,
	inDepthArticles,
	blogPosts,
	podcasts,
}: NewsIndexProps): React.ReactElement {
	const destinations = [
		{ url: "/news", title: "News" },
		{ url: "/news/articles", title: "News articles" },
		{ url: "/news/in-depth", title: "In-depth" },
		{ url: "/news/blogs", title: "Blogs" },
		{ url: "/news/podcasts", title: "Podcasts" },
	];

	const breadcrumbs = (
		<Breadcrumbs>
			<Breadcrumb to="/">Home</Breadcrumb>
			<Breadcrumb>News</Breadcrumb>
		</Breadcrumbs>
	);

	const pageTitle = "News, blogs and podcasts";

	return (
		<>
			<NextSeo title={pageTitle} openGraph={{ title: pageTitle }}></NextSeo>
			<PageHeader
				breadcrumbs={breadcrumbs}
				heading={pageTitle}
				variant="fullWidthDark"
			/>
			<NewsListNav destinations={destinations} />

			<h2>Latest articles</h2>
			<FeaturedStory story={newsArticles[0]} />
			<NewsGrid news={newsArticles.slice(1, 4)} />
			<p>
				<Link href="/news/articles">View all news articles</Link>
			</p>

			<h2>Latest in-depth</h2>
			{inDepthArticles.length}
			<h2>Latest blogs</h2>
			{blogPosts.length}
			<h2>Latest podcasts</h2>
			{podcasts.length}
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const version = getStoryVersionFromQuery(context.query);

	// Construct our query params
	const commonParams: ISbStoriesParams = {
		resolve_links: "url",
		sort_by: "content.date:desc",
	};

	const articleParams = {
		...commonParams,
		starts_with: "news/articles",
		per_page: 4,
	};

	const inDepthParams = {
		...commonParams,
		starts_with: "news/in-depth",
		per_page: 2,
	};

	const blogParams = {
		starts_with: "news/blogs",
		...commonParams,
		excluding_slugs: "news/blogs/authors/*",
		per_page: 2,
	};

	const podcastParams = {
		...commonParams,
		starts_with: "news/in-depth",
		per_page: 2,
	};

	const [newsArticles, inDepthArticles, blogPosts, podcasts] =
		await Promise.all([
			fetchStories<NewsArticleStoryblok>(version, articleParams),
			fetchStories<InDepthArticleStoryblok>(version, inDepthParams),
			fetchStories<BlogPostStoryblok>(version, blogParams),
			fetchStories<PodcastStoryblok>(version, podcastParams),
		]);

	console.log({ newsArticles });

	const result = {
		props: {
			newsArticles: newsArticles.stories,
			inDepthArticles: inDepthArticles.stories,
			blogPosts: blogPosts.stories,
			podcasts: podcasts.stories,
		},
	};
	return result;
}
