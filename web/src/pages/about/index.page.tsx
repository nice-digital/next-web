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
	const version = getStoryVersionFromQuery(context.query);
	const { data } = await fetchStory(slug, version);

	return {
		props: {
			story: data ? data.story : false,
		},
	};
}
