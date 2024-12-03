import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

export async function validateNewsArticleTag(text: string): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.tag, "");
	await checkContainsText("element", selectors.newsBlogsPodcasts.tag, "", text);
	await pause("2000");
}

export async function validateInDepthTag(text: string): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.tag, "");
	await checkContainsText("element", selectors.newsBlogsPodcasts.tag, "", text);
	await pause("2000");
}

export async function validateBlogsTag(text: string): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.tag, "");
	await checkContainsText("element", selectors.newsBlogsPodcasts.tag, "", text);
	await pause("2000");
}

export async function validatePodcastsTag(text: string): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.tag, "");
	await checkContainsText("element", selectors.newsBlogsPodcasts.tag, "", text);
	await pause("2000");
}

export async function validateNewsArticlePagination(
	text: string
): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.pagination, "");
	await checkContainsText(
		"element",
		selectors.newsBlogsPodcasts.pagination,
		"",
		text
	);
	await pause("2000");
}

export default validateNewsArticleTag;
