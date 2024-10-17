import { Then } from "@wdio/cucumber-framework";
import { expect } from "expect-webdriverio";

import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import { getSelector, SelectorName } from "../selectors/index.js";
import { clickNextPagination } from "../support/action/clickNextPagination.js";
import { clickPreviousPagination } from "../support/action/clickPreviousPagination.js";
import {
	indicatorList,
	indicatorHistory,
} from "../support/check/indicatorList.js";
import {
	validateIndicatorPageResultCount,
	validateFirstLinkInPagination,
} from "../support/check/validateIndicatorPageResultCount.js";

// eslint-disable-next-line import/no-unresolved

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

Then(/^I expect to see the overview and indicator list item$/, indicatorList);
Then(/^I expect to see the indicator history$/, indicatorHistory);

Then(
	/^I expect the result list count contains "([^"]*)"$/,
	validateIndicatorPageResultCount
);

Then(
	/^I expect the first pagination option is "([^"]*)"$/,
	validateFirstLinkInPagination
);

Then(/^I click the next page option$/, clickNextPagination);
Then(/^I click the previous page option$/, clickPreviousPagination);
