import {
	apiPlugin,
	getStoryblokApi,
	storyblokInit,
	type ISbStoriesParams,
	type ISbResult,
	type ISbStory,
	type ISbError,
	type ISbStoryData,
} from "@storyblok/react";
import { type MetaTag } from "next-seo/lib/types";

import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { CategoryNavigation } from "@/components/Storyblok/CategoryNavigation/CategoryNavigation";
import { Homepage } from "@/components/Storyblok/Homepage/Homepage";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { StoryblokHero } from "@/components/Storyblok/StoryblokHero/StoryblokHero";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { type MultilinkStoryblok } from "@/types/storyblok";

export type StoryVersion = "draft" | "published" | undefined;
export type SBSingleResponse = {
	story: ISbStory;
};
export type SBMultipleResponse = {
	stories: ISbStory[];
};
export type SBNotFoundResponse = {
	notFound: true;
};

// Init connection to Storyblok
export const initStoryblok = (): void => {
	const components = {
		cardGrid: CardGrid,
		categoryNavigation: CategoryNavigation,
		homepage: Homepage,
		hero: StoryblokHero,
		metadata: Metadata,
	};

	try {
		logger.warn("About to init Storyblok");
		const accessToken = publicRuntimeConfig.storyblok.previewAccessToken;

		storyblokInit({
			accessToken,
			use: [apiPlugin],
			components,
		});

		logger.warn("Successfully initialised Storyblok");
	} catch (e) {
		logger.error("Error initialising Storyblok:", e);
	}
};

// Fetch a single story from the Storyblok API
export const fetchStory = async (
	slug: string,
	version: StoryVersion
): Promise<SBSingleResponse | SBNotFoundResponse> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
		resolve_links: "url",
		// cv: Date.now(), // Useful for flushing the Storyblok cache
	};

	let result = null;

	try {
		const story: ISbResult = await storyblokApi.get(
			`cdn/stories/${slug}`,
			sbParams
		);
		result = {
			story: story.data.story,
		};
	} catch (e) {
		const result = JSON.parse(e as string) as ISbError;
		logger.error(
			`${result.status} error from Storyblok API: ${result.message}`,
			e
		);
		if (result.status === 404) {
			return {
				notFound: true,
			};
		} else {
			throw Error(
				`${result.status} error from Storyblok API: ${result.message}`
			);
		}
	}

	return result;
};

// Fetch multiple stories from the Storyblok API
export const fetchStories = async (
	slugs: string[],
	version: StoryVersion
): Promise<SBMultipleResponse | SBNotFoundResponse> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
		resolve_links: "url",
		by_slugs: slugs.join(","),
		// cv: Date.now(), // Useful for flushing the Storyblok cache
	};

	let result = null;

	try {
		const stories: ISbResult = await storyblokApi.get(`cdn/stories`, sbParams);
		result = {
			stories: stories.data.stories,
		};
	} catch (e) {
		const result = JSON.parse(e as string) as ISbError;
		logger.error(
			`${result.status} error from Storyblok API: ${result.message}`,
			e
		);
		throw Error(`${result.status} error from Storyblok API: ${result.message}`);
	}

	return result;
};

// Resolve a link object returned from the Storyblok API, so that it returns
// something that can be plugged straight into an href attribute
export const resolveStoryblokLink = ({
	linktype,
	url,
	email,
	story,
}: MultilinkStoryblok): string | undefined => {
	switch (linktype) {
		case "url":
		case "asset":
			return url?.trim() || undefined;
		case "email":
			return email?.trim() ? `mailto:${email.trim()}` : undefined;
		case "story":
			return story?.full_slug ? `/${story.full_slug}` : undefined;
		default:
			return undefined;
	}
};

// Figure out whether we're requesting the draft or published version,
// depending on the existence of the _storyblok query parameter
export const getStoryVersionFromQuery = (query?: {
	_storyblok?: string;
}): StoryVersion => {
	return (query && query._storyblok) === "" ? "draft" : "published";
};

// Resolve the slug object from the NextJS query params into a full slug that we
// can use to request content from the Storyblok API
export const getSlugFromParams = (
	slugParams: string | string[] | undefined
): string | undefined => {
	if (!slugParams) {
		return undefined;
	}

	return Array.isArray(slugParams) ? slugParams.join("/") : slugParams;
};

// Resolve the slug object from the NextJS query params into a list of full
// slugs that we can use to build breadcrumbs, for example
export const getSlugHierarchyFromParams = (
	slugParams: string | string[] | undefined,
	prefix: string
): string[] => {
	if (!slugParams) {
		return [];
	}

	const hierarchy: string[] = [`${prefix}/`];

	if (Array.isArray(slugParams)) {
		for (let i = 0; i < slugParams.length - 1; i++) {
			let newSlug = `${prefix}/`;
			for (let j = 0; j <= i; j++) {
				newSlug = `${newSlug}${slugParams[j]}/`;
			}
			hierarchy.push(newSlug);
		}
	} else {
		hierarchy.push(`${prefix}/${slugParams}/`);
	}

	return hierarchy;
};

// Get metadata that can be derived from the Storyblok response
// e.g. DC.Issued, DC.Modified
export const getAdditionalMetaTags = (story: ISbStoryData): MetaTag[] => {
	const additionalMetaTags = [
		{ name: "DC.Issued", content: story?.created_at || "" },
		{
			name: "DC.Modified",
			content: story?.published_at || story?.created_at || "",
		},
	];
	return additionalMetaTags;
};
