import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import selectors from "../selectors.js";

export async function clickNewsTab(): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.newsArticleTab, "");
	await clickElement(
		"click",
		"selector",
		selectors.newsBlogsPodcasts.newsArticleTab
	);
	await pause("2000");
}

export async function clickInDepthTab(): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.inDepthTab, "");
	await clickElement(
		"click",
		"selector",
		selectors.newsBlogsPodcasts.inDepthTab
	);
	await pause("2000");
}

export async function clickBlogsTab(): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.blogsTab, "");
	await clickElement("click", "selector", selectors.newsBlogsPodcasts.blogsTab);
	await pause("2000");
}

export async function clickPodcastsTab(): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.podcastsTab, "");
	await clickElement(
		"click",
		"selector",
		selectors.newsBlogsPodcasts.podcastsTab
	);
	await pause("2000");
}

export async function clickNewslink(): Promise<void> {
	// await browser.scroll(900, 900);
	const newsLink = await $(selectors.home.homeSectionLink1);
	await newsLink.waitForExist({ timeout: 20000 });
	await newsLink.scrollIntoView();
	await newsLink.scrollIntoView({ block: "center", inline: "center" });
	await waitForDisplayed(selectors.home.homeNewLink, "");
	await clickElement("click", "selector", selectors.home.homeNewLink);
	await pause("2000");
}
export default clickNewsTab;
