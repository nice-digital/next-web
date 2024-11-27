import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { isDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/check/isDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

export async function validateBlogAuthorImage(): Promise<void> {
	// await waitForDisplayed(selectors.blog.blogAuthorImage, "");
	await isDisplayed(selectors.blog.blogAuthorImage, "");
	await pause("2000");
}

export async function validateBlogAuthorName(text: string): Promise<void> {
	await waitForDisplayed(selectors.blog.blogAuthorName, "");
	await checkContainsText("element", selectors.blog.blogAuthorName, "", text);
	await pause("2000");
}

export async function validateBlogAuthorTitle(text: string): Promise<void> {
	await waitForDisplayed(selectors.blog.blogAuthorTitle, "");
	await checkContainsText("element", selectors.blog.blogAuthorTitle, "", text);
	await pause("2000");
}

export async function validateRelatedNewsStory(text: string): Promise<void> {
	await waitForDisplayed(selectors.news.relatedNewsStory, "");
	await checkContainsText("element", selectors.news.relatedNewsStory, "", text);
	await pause("2000");
}
export default validateBlogAuthorImage;

