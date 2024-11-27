import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

export async function validateIndicatorPageResultCount(
	countText: string
): Promise<void> {
	await waitForDisplayed(".filter-summary__count:nth-child(1)", "");
	await checkContainsText("element", ".filter-summary__count:nth-child(1)", "", countText);
	await pause("5000");

	const elem = await $(".horizontal-nav__list:nth-child(1)");
	await elem.scrollIntoView({ block: "center", inline: "center" });
}

export async function validateFirstLinkInPagination(
	linkText: string
): Promise<void> {
	await pause("2000");
	await waitForDisplayed(selectors.indicatorsPage.firstPager, "");
	await pause("2000");
	await checkContainsText(
		"element",
		selectors.indicatorsPage.firstPager,
		"",
		linkText
	);
	await pause("5000");
}

export default validateIndicatorPageResultCount;