import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import { fetchStory, getStoryVersionFromQuery } from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface AboutProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
}

export default function AboutIndex({
	story,
	breadcrumbs,
}: AboutProps): React.ReactElement {
	return (
		<>
			<StoryblokComponent blok={story.content} breadcrumbs={breadcrumbs} />
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const slug = "about";
	const { query } = context;
	const version = getStoryVersionFromQuery(query);

	const storyResult = await fetchStory(slug, version);
	const breadcrumbs = [{ title: "About" }];

	const result = {
		props: {
			...storyResult,
			breadcrumbs,
		},
	};
	return result;
}
