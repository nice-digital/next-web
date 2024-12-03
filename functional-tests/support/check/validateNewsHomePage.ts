import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

export async function validateNewsHomePage(text: string): Promise<void> {
	await waitForDisplayed(selectors.newsBlogsPodcasts.newsHomeheading, "");
	await checkContainsText(
		"element",
		selectors.newsBlogsPodcasts.newsHomeheading,
		"",
		text
	);
	await pause("2000");
}

export async function validateIndicatorHeading(text: string): Promise<void> {
	await waitForDisplayed(selectors.indicator.indicatorHeading, "");
	await checkContainsText(
		"element",
		selectors.indicator.indicatorHeading,
		"",
		text
	);
	await pause("2000");
}

export async function validateIndicatorNavItem1(text: string): Promise<void> {
	await waitForDisplayed(selectors.indicator.horizontalNav1, "");
	await checkContainsText(
		"element",
		selectors.indicator.horizontalNav1,
		"",
		text
	);
	await pause("2000");
}

export async function validateIndicatorNavItem2(text: string): Promise<void> {
	await waitForDisplayed(selectors.indicator.horizontalNav2, "");
	await checkContainsText(
		"element",
		selectors.indicator.horizontalNav2,
		"",
		text
	);
	await pause("2000");
}

export async function validateHubHeading(text: string): Promise<void> {
	await waitForDisplayed(selectors.hub.hubHeading1, "");
	await checkContainsText("element", selectors.hub.hubHeading1, "", text);
	await pause("2000");
}

export async function validateHubTableText(text: string): Promise<void> {
	await waitForDisplayed(selectors.hub.tableHeading, "");
	await checkContainsText("element", selectors.hub.tableHeading, "", text);
	await pause("2000");
}

export default validateNewsHomePage;
