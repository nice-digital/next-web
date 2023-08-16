import {
	type ISbStoriesParams,
	type ISbStoryData,
	getStoryblokApi,
} from "@storyblok/react";
import React from "react";

interface AboutProps {
	story: ISbStoryData;
	key: string;
}

export default function AboutIndex(props: AboutProps): React.ReactElement {
	return (
		<>
			<h2>About</h2>
			<p>{props.story.content.body[0].name || "Didn't find anything"}</p>
		</>
	);
}

export async function getServerSideProps() {
	// home is the default slug for the homepage in Storyblok
	const slug = "about";

	// load the draft version
	const sbParams: ISbStoriesParams = {
		version: "draft", // or 'published'
	};

	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

	console.log("SB data:", data);
	console.log("SB content body:", data.story.content.body);

	return {
		props: {
			story: data ? data.story : false,
			key: data ? data.story.id : false,
		},
	};
}
