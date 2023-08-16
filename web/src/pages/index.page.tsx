import { type ISbStoryData } from "@storyblok/react";
import React from "react";

import { fetchStory } from "@/utils/storyblok";

interface HomeProps {
	story: ISbStoryData;
	key: string;
}

export default function Home(props: HomeProps): React.ReactElement {
	return (
		<>
			<h1>Homepage</h1>
			{props.story ? props.story.name : "My Site"}
		</>
	);
}

export async function getServerSideProps() {
	const slug = "home";
	const version = "draft";

	const { data } = await fetchStory(slug, version);

	return {
		props: {
			story: data ? data.story : false,
			key: data ? data.story.id : false,
		},
	};
}
