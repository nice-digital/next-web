import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import React from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface AboutProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
}

export default function AboutCatchAll({
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
	const { query, params } = context;

	// Resolve slug from params
	let slug = getSlugFromParams(params?.slug);
	if (slug) {
		slug = `about/${slug}`;

		const version = getStoryVersionFromQuery(query);
		const storyResult = await fetchStory(slug, version);

		// TODO: Wire up breadcrumbs
		const breadcrumbs = [
			{ title: "About", path: "/about" },
			{ title: "To do: wire up breadcrumbs" },
		];

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
