import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import { fetchStory } from "@/utils/storyblok";

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

export async function getServerSideProps() {
	const slug = "about";
	const version = "draft";
	const { data } = await fetchStory(slug, version);

	return {
		props: {
			story: data ? data.story : false,
		},
	};
}
