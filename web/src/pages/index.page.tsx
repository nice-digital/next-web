import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import {
	fetchStory,
	getStoryVersionFromQuery,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface HomeProps {
	story: ISbStoryData;
}

export default function Home({ story }: HomeProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	return (
		<>
			<NextSeo
				title="Homepage"
				openGraph={{ title: "Homepage" }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<h1>Homepage</h1>
			<StoryblokComponent blok={story.content} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const slug = "home";
	const version = getStoryVersionFromQuery(context.query);
	const storyResult = await fetchStory(slug, version);

	console.log("****************** Story result:", storyResult);

	const result = {
		props: {
			...storyResult,
		},
	};
	return result;
}
