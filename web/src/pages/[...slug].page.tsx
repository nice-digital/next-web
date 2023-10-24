import { type ISbStoryData, StoryblokComponent } from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface SlugCatchAllProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
}

export default function SlugCatchAll({
	story,
	breadcrumbs,
}: SlugCatchAllProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);
	const title = story.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
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
			{ title: "Something", path: "/something" },
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
