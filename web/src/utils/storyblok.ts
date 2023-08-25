import {
	type ISbStoriesParams,
	getStoryblokApi,
	ISbResult,
} from "@storyblok/react";

import { type MultilinkStoryblok } from "@/types/storyblok";

export type StoryVersion = "draft" | "published" | undefined;

// Fetch a single story from the Storyblok API
export const fetchStory = async (
	slug: string,
	version: StoryVersion
): Promise<ISbResult> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
		resolve_links: "url",
	};

	const story: ISbResult = await storyblokApi.get(
		`cdn/stories/${slug}`,
		sbParams
	);

	return story;
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

export const getStoryVersionFromQuery = (query: {
	_storyblok?: string;
}): StoryVersion => {
	return query._storyblok === "" ? "draft" : "published";
};
