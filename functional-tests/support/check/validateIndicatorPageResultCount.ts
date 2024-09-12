import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

export async function validateIndicatorPageResultCount(
	countText: string
): Promise<void> {
	await waitForDisplayed("div.filter-summary__count", "");
	await checkContainsText(
		"element",
		"div.filter-summary__count",
		"",
		countText
	);
	await pause("5000");

	const elem = await $(".horizontal-nav__list:nth-child(1)");
	await elem.scrollIntoView({ block: "center", inline: "center" });
}

export default validateIndicatorPageResultCount;
