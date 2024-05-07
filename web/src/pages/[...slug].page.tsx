import {
	type ISbStoryData,
	StoryblokComponent,
	setComponents,
} from "@storyblok/react";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { Blockquote } from "@/components/Storyblok/Blockquote/Blockquote";
import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { InfoPage } from "@/components/Storyblok/InfoPage/InfoPage";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { NestedRichText } from "@/components/Storyblok/NestedRichText/NestedRichText";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { StoryblokIframe } from "@/components/Storyblok/StoryblokIframe/StoryblokIframe";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { publicRuntimeConfig } from "@/config";
import { type Breadcrumb } from "@/types/Breadcrumb";
import {
	CategoryNavigationStoryblok,
	InfoPageStoryblok,
} from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getAdditionalMetaTags,
	getBreadcrumbs,
} from "@/utils/storyblok";

import type { GetServerSidePropsContext } from "next";

interface SlugCatchAllProps {
	story: ISbStoryData;
	breadcrumbs: Breadcrumb[];
	siblingPages?: string[]; // Eventually this will be an array of pages
	component: string;
}

export default function SlugCatchAll({
	story,
	breadcrumbs,
	siblingPages,
	component,
}: SlugCatchAllProps): React.ReactElement {
	const additionalMetaTags = useMemo(
		() => getAdditionalMetaTags(story),
		[story]
	);

	const commonComponents = {
		cardGrid: CardGrid,
		metadata: Metadata,
		pageHeader: StoryblokPageHeader,
	};

	const infoPageComponents = {
		hero: StoryblokHero,
		iframe: StoryblokIframe,
		infoPage: InfoPage,
		nestedRichText: NestedRichText,
		quote: Blockquote,
		youtubeEmbed: StoryblokYoutubeEmbed,
	};

	const components = {
		...commonComponents,
		...(component === "infoPage"
			? infoPageComponents
			: { categoryNavigation: CategoryNavigation }),
	};

	setComponents(components);

	const title = story.name;

	return (
		<>
			<NextSeo
				title={title}
				openGraph={{ title: title }}
				additionalMetaTags={additionalMetaTags}
			></NextSeo>
			<StoryblokComponent
				blok={story.content}
				breadcrumbs={breadcrumbs}
				siblingPages={siblingPages}
			/>
		</>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// Bail out early unless this route is enabled for this environment
	if (publicRuntimeConfig.storyblok.enableRootCatchAll.toString() !== "true") {
		return {
			notFound: true,
		};
	}

	const { query, params } = context;

	// Resolve slug from params
	const slug = getSlugFromParams(params?.slug);
	if (slug) {
		const version = getStoryVersionFromQuery(query);

		// Get the story and its breadcrumbs
		const [storyResult, breadcrumbs] = await Promise.all([
			fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(
				slug,
				version
			),
			getBreadcrumbs(slug, version),
		]);

		// will return a 404 if the story is not found
		if ("notFound" in storyResult) return storyResult;

		const siblingPages = [];

		const component = storyResult.story?.content?.component;
		// TODO: Use the Storyblok Links API to build a map of sibling & optionally child pages
		if (component === "infoPage") {
			siblingPages.push(...["page1", "page2"]);
		}

		const result = {
			props: {
				...storyResult,
				breadcrumbs,
				siblingPages,
				component,
			},
		};

		return result;
	} else {
		return {
			notFound: true,
		};
	}
}
