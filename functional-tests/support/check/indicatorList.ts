import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

export async function indicatorList(): Promise<void> {
	await waitForDisplayed(".stacked-nav__list-item:nth-of-type(1)", "");
	await checkContainsText(
		"element",
		".stacked-nav__list-item:nth-of-type(1)",
		"",
		"Overview"
	);
	await pause("2000");

	await waitForDisplayed(".stacked-nav__list-item:nth-of-type(2)", "");
	await checkContainsText(
		"element",
		".stacked-nav__list-item:nth-of-type(1)",
		"",
		"Indicator"
	);
	await pause("2000");
}

export async function indicatorHistory(): Promise<void> {
	await waitForDisplayed("h2.ResourceList_title__3LU_p", "");
	await checkContainsText(
		"element",
		"h2.ResourceList_title__3LU_p",
		"",
		"History"
	);
	await pause("2000");
}
export default indicatorList;
