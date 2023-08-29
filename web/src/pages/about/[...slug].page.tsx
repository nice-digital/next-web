import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
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
	const { query, params } = context;

	// Resolve slug from params
	let slug = getSlugFromParams(params?.slug);
	if (slug) {
		slug = `about/${slug}`;
		const version = getStoryVersionFromQuery(query);
		const result = await fetchStory(slug, version);
		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
