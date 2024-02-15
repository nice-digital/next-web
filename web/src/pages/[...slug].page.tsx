import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	getBreadcrumbs,
	initStoryblok,
} from "@/utils/storyblok";

import * as StoryblokComponents from "../components/Storyblok/";

import type { GetServerSidePropsContext } from "next";

interface SlugCatchAllProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
}

const requiredComponents = {
	cardGrid: StoryblokComponents.CardGrid,
	categoryNavigation: StoryblokComponents.CategoryNavigation,
	metadata: StoryblokComponents.Metadata,
	pageHeader: StoryblokComponents.StoryblokPageHeader,
};

initStoryblok(requiredComponents);

export default function SlugCatchAll({
	story,
	breadcrumbs,
}: SlugCatchAllProps): React.ReactElement {
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
			<StoryblokComponent blok={story.content} breadcrumbs={breadcrumbs} />
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
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory(slug, version),
			getBreadcrumbs(slug, version),
		]);

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
