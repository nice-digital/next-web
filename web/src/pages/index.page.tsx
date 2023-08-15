import { getStoryblokApi } from "@storyblok/react";
import React from "react";

export default function Home(props): React.ReactElement {
	return (
		<>
			<h1>Homepage</h1>
			{props.story ? props.story.name : "My Site"}
		</>
	);
}

export async function getStaticProps() {
	// home is the default slug for the homepage in Storyblok
	const slug = "home";

	// load the draft version
	const sbParams = {
		version: "draft", // or 'published'
	};

	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

	console.log("SB data:", data);

	return {
		props: {
			story: data ? data.story : false,
			key: data ? data.story.id : false,
		},
		revalidate: 3600, // revalidate every hour
	};
}
