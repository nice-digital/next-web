import { ISbStoriesParams } from "@storyblok/react";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Card } from "@nice-digital/nds-card";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsCard } from "@/components/Storyblok/News/NewsCard/NewsCard";
import { NewsGrid } from "@/components/Storyblok/News/NewsGrid/NewsGrid";
import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";
import {
	BlogPostStoryblok,
	InDepthArticleStoryblok,
	NewsArticleStoryblok,
	PodcastStoryblok,
} from "@/types/storyblok";
import {
	getStoryVersionFromQuery,
	fetchStories,
	defaultPodcastImage,
	friendlyDate,
} from "@/utils/storyblok";

import styles from "./index.module.scss";

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
				id="content-start"
				breadcrumbs={breadcrumbs}
				heading={pageTitle}
				variant="fullWidthDark"
			/>
			<NewsListNav />

			<section className={styles.section}>
				<div className={styles.sectionContainer}>
					<h2>Latest articles</h2>
					<FeaturedStory story={newsArticles[0]} />
					<NewsGrid news={newsArticles.slice(1, 4)} />
					<p>
						<Link href="/news/articles">View all news articles</Link>
					</p>
				</div>
			</section>

			<section className={`${styles.section} ${styles.darkSection}`}>
				<div className={styles.sectionContainer}>
					<h2>Latest in-depth</h2>
					<ul className={styles.newsCardList}>
						{inDepthArticles.map((article) => (
							<li key={article.id}>
								<NewsCard story={article} />
							</li>
						))}
					</ul>
					<p>
						<Link href="/news/in-depth">View all in-depth</Link>
					</p>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionContainer}>
					<h2>Latest blogs</h2>
					<ul className={styles.newsCardList}>
						{blogPosts.map((post) => (
							<li key={post.id}>
								<NewsCard story={post} />
							</li>
						))}
					</ul>
					<p>
						<Link href="/news/blogs">View all blogs</Link>
					</p>
				</div>
			</section>

			<section className={`${styles.section} ${styles.darkSection}`}>
				<div className={styles.sectionContainer}>
					<h2>Latest podcasts</h2>
					<div className={styles.podcastWrapper}>
						<ul className={`list--unstyled ${styles.podcastList}`}>
							{podcasts.map((podcast) => {
								const { name, full_slug, content } = podcast;
								return (
									<li key={podcast.id}>
										<Card
											headingText={name}
											headingElementType="h3"
											link={{
												destination: full_slug,
												elementType: Link,
											}}
										>
											{content.introText}
											<footer className={styles.podcastFooter}>
												<Tag outline>Podcast</Tag>
												<span className={styles.podcastDate}>
													{friendlyDate(content.date)}
												</span>
											</footer>
										</Card>
									</li>
								);
							})}
						</ul>
						<Image
							src={defaultPodcastImage}
							className={styles.podcastImage}
							alt=""
							role="presentation"
							width={400}
							height={400}
						/>
					</div>
					<p>
						<Link href="/news/podcasts">View all podcasts</Link>
					</p>
				</div>
			</section>

			<div className={styles.newsletterSignup}>
				<NewsLetterSignup />
			</div>
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
		resolve_relations: "blogPost.author",
		per_page: 2,
	};

	const podcastParams = {
		...commonParams,
		starts_with: "news/podcasts",
		per_page: 2,
	};

	const [newsArticles, inDepthArticles, blogPosts, podcasts] =
		await Promise.all([
			fetchStories<NewsArticleStoryblok>(version, articleParams),
			fetchStories<InDepthArticleStoryblok>(version, inDepthParams),
			fetchStories<BlogPostStoryblok>(version, blogParams),
			fetchStories<PodcastStoryblok>(version, podcastParams),
		]);

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
