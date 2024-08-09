import { Then } from "@wdio/cucumber-framework";
import { expect } from "expect-webdriverio";

import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

// eslint-disable-next-line import/no-unresolved
import { getSelector, SelectorName } from "../selectors/index.js";

// Then(
// 	"I expect that element {string} contains the text {string}",
// 	async (selector, expectedText) => {
// 		const element = await browser.$(selector);
// 		const actualText = await element.getText();
// 		expect(actualText).toContain(expectedText);
// 	}
// );

Then(
	/^I expect to see "([^"]*)" in the autocomplete suggestions$/,
	async (text: string) => {
		const optionElement = await $(
			(await getSelector("autocomplete option")) + ":not(.visually-hidden)"
		);
		await optionElement.waitForExist({ timeout: 20000 });

		const menuSelector = await getSelector("autocomplete menu");
		await checkContainsText("element", menuSelector, "", text);
	}
);
