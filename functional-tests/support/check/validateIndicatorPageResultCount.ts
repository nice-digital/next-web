import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import selectors from "../selectors.js";

// Wait until the element's text actually contains the expected value before
// asserting. Elements like the filter summary are always displayed (showing
// the OLD count while a filter applies), so displayed/existence waits pass
// instantly and asserts read stale text - the reason fixed pauses crept in.
async function waitForTextContains(
	selector: string,
	text: string
): Promise<void> {
	const element = await $(selector);
	await browser.waitUntil(
		async () => (await element.getText()).includes(text),
		{
			timeout: 15000,
			timeoutMsg: `Element "${selector}" did not contain text "${text}" within 15s`,
		}
	);
}

export async function validateIndicatorPageResultCount(
	countText: string
): Promise<void> {
	await waitForTextContains(".filter-summary__count:nth-child(1)", countText);
	await checkContainsText(
		"element",
		".filter-summary__count:nth-child(1)",
		"",
		countText
	);
}

export async function validateIndicatorPageNoResultCount(
	countText: string
): Promise<void> {
	await waitForTextContains("#results h2", countText);
	await checkContainsText("element", "#results h2", "", countText);
}

export async function validateFirstLinkInPagination(
	linkText: string
): Promise<void> {
	await waitForTextContains(selectors.indicatorsPage.firstPager, linkText);
	await checkContainsText(
		"element",
		selectors.indicatorsPage.firstPager,
		"",
		linkText
	);
}

export default validateIndicatorPageResultCount;
