import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useEffect, useMemo } from "react";

import { logger } from "@/logger";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getAdditionalMetaTags,
	initStoryblok,
} from "@/utils/storyblok";

import * as StoryblokComponents from "../components/Storyblok/";

import type { GetServerSidePropsContext } from "next";

interface HomeProps {
	story: ISbStoryData;
}

const requiredComponents = {
	cardGrid: StoryblokComponents.CardGrid,
	homepage: StoryblokComponents.Homepage,
	hero: StoryblokComponents.StoryblokHero,
	metadata: StoryblokComponents.Metadata,
};

(async () => {
	await initStoryblok(requiredComponents);
})();

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
	logger.warn("Start server side props for homepage");
	const slug = "home";
	const version = getStoryVersionFromQuery(context.query);
	const storyResult = await fetchStory(slug, version);

	console.log("****************** Story result:", storyResult);

	logger.warn("Finish server side props for homepage");

	const result = {
		props: {
			...storyResult,
		},
	};
	return result;
}
