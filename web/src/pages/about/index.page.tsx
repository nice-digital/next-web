import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import {
	fetchStory,
	fetchStories,
	getStoryVersionFromQuery,
	getSlugHierarchyFromParams,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface AboutProps {
	story: ISbStoryData;
}

export default function AboutIndex({ story }: AboutProps): React.ReactElement {
	return (
		<>
			<StoryblokComponent blok={story.content} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const slug = "about";
	const { query, params } = context;
	const hierarchy = getSlugHierarchyFromParams(params?.slug, "about");
	const version = getStoryVersionFromQuery(query);

	// TODO: Fix this, breadcrubms should be easier to hard-code
	// Should be a utility function for transforming stories to breadcrumbs
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
}
