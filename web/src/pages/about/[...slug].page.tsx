import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import {
	fetchStory,
	fetchStories,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getSlugHierarchyFromParams,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface AboutProps {
	story: ISbStoryData;
	breadcrumbs: {
		stories: ISbStoryData[];
	};
}

export default function AboutCatchAll({
	story,
	breadcrumbs,
}: AboutProps): React.ReactElement {
	return (
		<>
			<StoryblokComponent blok={story.content} breadcrumbs={breadcrumbs} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { query, params } = context;

	// Resolve slug from params
	let slug = getSlugFromParams(params?.slug);
	if (slug) {
		slug = `about/${slug}`;

		// Get breadcrumbs from params
		const hierarchy = getSlugHierarchyFromParams(params?.slug, "about");
		const version = getStoryVersionFromQuery(query);

		const [storyResult, hierarchyResult] = await Promise.all([
			fetchStory(slug, version),
			fetchStories(hierarchy, version),
		]);

		const result = {
			props: {
				...storyResult,
				breadcrumbs: { ...hierarchyResult },
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
