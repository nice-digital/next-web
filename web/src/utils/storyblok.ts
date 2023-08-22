import {
	type ISbStoriesParams,
	getStoryblokApi,
	ISbResult,
} from "@storyblok/react";
import { ISbLinkURLObject } from "storyblok-js-client";

// Fetch a single story from the Storyblok API
export const fetchStory = async (
	slug: string,
	version: "draft" | "published" | undefined
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
}: ISbLinkURLObject): string => {
	switch (linktype) {
		default:
			return "Hello";
	}
};
