import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface AboutProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
}

export default function AboutIndex({
	story,
	breadcrumbs,
}: AboutProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	return (
		<>
			<NextSeo
				title="About"
				openGraph={{ title: "About" }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
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
