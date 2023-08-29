import {
	type ISbStoriesParams,
	getStoryblokApi,
	ISbResult,
	ISbStory,
} from "@storyblok/react";

import { type MultilinkStoryblok } from "@/types/storyblok";

export type StoryVersion = "draft" | "published" | undefined;
export type SBOKResponse = {
	props: {
		story: ISbStory;
	};
};
export type SBNotFoundResponse = {
	notFound: true;
};

// Fetch a single story from the Storyblok API
export const fetchStory = async (
	slug: string,
	version: StoryVersion
): Promise<SBOKResponse | SBNotFoundResponse> => {
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
			props: {
				story: story.data.story,
			},
		};
	} catch (e) {
		// TODO: Deal with other error types
		// Currently we're just treating everything as a 404
		// Leaving the line in to remember that the error obj needs parsing
		// result = JSON.parse(e as string) as ISbError;
		return {
			notFound: true,
		};
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
