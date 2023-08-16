import { type ISbStoryData } from "@storyblok/react";
import React from "react";

import { fetchStory } from "@/utils/storyblok";

interface AboutProps {
	story: ISbStoryData;
	key: string;
}

export default function AboutIndex(props: AboutProps): React.ReactElement {
	return (
		<>
			<h1>About</h1>
			<p>{props.story.content.body[0].name || "Didn't find anything"}</p>
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
			key: data ? data.story.id : false,
		},
	};
}
