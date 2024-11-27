import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

export async function validateHomeSection(text: string): Promise<void> {
	await waitForDisplayed(selectors.home.homeSectionHeading, "");
	await checkContainsText(
		"element",
		selectors.home.homeSectionHeading,
		"",
		text
	);
	await pause("2000");
}

export async function validateHomeSectionLink1(text: string): Promise<void> {
	await waitForDisplayed(selectors.home.homeSectionLink1, "");
	await checkContainsText("element", selectors.home.homeSectionLink1, "", text);
	await pause("2000");
}
export async function validateHomeSectionLink2(text: string): Promise<void> {
	await waitForDisplayed(selectors.home.homeSectionLink2, "");
	await checkContainsText("element", selectors.home.homeSectionLink2, "", text);
	await pause("2000");
}

export default validateHomeSection;
