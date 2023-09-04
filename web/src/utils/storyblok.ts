import {
	type ISbStoriesParams,
	getStoryblokApi,
	ISbResult,
	ISbStory,
	ISbError,
} from "@storyblok/react";

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

// Fetch a single story from the Storyblok API
export const fetchStory = async (
	slug: string,
	version: StoryVersion
): Promise<SBSingleResponse | SBNotFoundResponse> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
		resolve_links: "url",
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
			return url.trim() || undefined;
		case "email":
			return email.trim() ? `mailto:${email.trim()}` : undefined;
		case "story":
			return story?.full_slug ? `/${story.full_slug}` : undefined;
		default:
			return undefined;
	}
};

// Figure out whether we're requesting the draft or published version,
// depending on the existence of the _storyblok query parameter
export const getStoryVersionFromQuery = (query: {
	_storyblok?: string;
}): StoryVersion => {
	return query._storyblok === "" ? "draft" : "published";
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
