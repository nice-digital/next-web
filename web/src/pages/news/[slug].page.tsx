import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

// import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface NewsArticlePageProps {
	story: ISbStoryData;
}

export default function NewsArticlePage({
	story,
}: NewsArticlePageProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);
	const title = story.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<h2></h2>
			<StoryblokComponent blok={story.content} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;

	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);

	if (slug) {
		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const [storyResult] = await Promise.all([
			fetchStory(`news-blogs-and-podcasts/news/${slug}`, version),
		]);

		const result = {
			props: {
				...storyResult,
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
