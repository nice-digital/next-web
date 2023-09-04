import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import { fetchStory, getStoryVersionFromQuery } from "@/utils/storyblok";

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
	const { query } = context;
	const version = getStoryVersionFromQuery(query);

	const storyResult = await fetchStory(slug, version);

	const result = {
		props: {
			...storyResult,
		},
	};
	return result;
}
