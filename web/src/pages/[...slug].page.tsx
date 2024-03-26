import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	CategoryNavigationStoryblok,
	InfoPageStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	getBreadcrumbs,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface SlugCatchAllProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
	siblingPages?: string[]; // Eventually this will be an array of pages
}

export default function SlugCatchAll({
	story,
	breadcrumbs,
	siblingPages,
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
			<StoryblokComponent
				blok={story.content}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
			/>
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
			fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(
				slug,
				version
			),
			getBreadcrumbs(slug, version),
		]);

		const siblingPages = [];

		const component = storyResult.story?.content?.component;
		// TODO: Use the Storyblok Links API to build a map of sibling & optionally child pages
		if (component === "infoPage") {
			siblingPages.push(...["page1", "page2"]);
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
				siblingPages,
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
