import {
	type ISbStoriesParams,
	getStoryblokApi,
	ISbResult,
} from "@storyblok/react";

export const fetchStory = async (
	slug: string,
	version: "draft" | "published" | undefined
): Promise<ISbResult> => {
	const storyblokApi = getStoryblokApi();

	const sbParams: ISbStoriesParams = {
		version: version || "published",
	};

	const story: ISbResult = await storyblokApi.get(
		`cdn/stories/${slug}`,
		sbParams
	);

	console.log("Story:", story);

	return story;
};
