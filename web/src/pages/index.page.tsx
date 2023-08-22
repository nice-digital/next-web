import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import { fetchStory } from "@/utils/storyblok";

interface HomeProps {
	story: ISbStoryData;
	key: string;
}

export default function Home({ story }: HomeProps): React.ReactElement {
	return (
		<>
			<h1>Homepage</h1>
			<StoryblokComponent blok={story.content} />
		</>
	);
}

export async function getServerSideProps() {
	const slug = "homepage";
	const version = "draft";

	const { data } = await fetchStory(slug, version);

	return {
		props: {
			story: data ? data.story : false,
			key: data ? data.story.id : false,
		},
	};
}
