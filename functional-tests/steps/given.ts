import { Given } from "@wdio/cucumber-framework";
import { expect } from "expect-webdriverio";

import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import { acceptCookieBanner } from "../support/action/acceptCookieBanner.js";
import {
	indicatorFilter,
	indicatorFilterDate,
} from "../support/action/indicatorFilter.js";
import { getPath, PageName } from "../support/pagePaths.js";

/*! https://github.com/webdriverio/cucumber-boilerplate/blob/master/src/support/action/openWebsite.js */
/**
 * Open the given URL
 * @param  {String}   type Type of navigation (url or site)
 * @param  {String}   page The URL to navigate to
 */
export async function openWebsite(
	type: "url" | "site",
	page: string
): Promise<void> {
	const url = type === "url" ? page : browser.options.baseUrl + page;

	await browser.url(url);
}

Given(/^I open the (.*) page$/, async (pageName: PageName) => {
	await openWebsite("url", getPath(pageName));
	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	await acceptCookieBanner();
});

Given(/^I click on the home breadcrumb link$/, async () => {
	await waitForDisplayed(".breadcrumbs__crumb a", "");
	await clickElement("click", "selector", ".breadcrumbs__crumb a");
});

Given(
	/^I enter keyword or reference number "([^"]*)" to filter page list$/,
	indicatorFilter
);

Given(/^I enter From date "([^"]*)" to filter page list$/, indicatorFilterDate);

Given(/^I enter name details in the jotform field$/, async () => {
	const iframe = await $(`iframe`);
	await iframe.waitForExist({ timeout: 20000 });
	await iframe.scrollIntoView();
	await browser.switchToFrame(iframe);
	await expect(await $("#first_7").isExisting()).toBe(true);
	await $("#first_7").addValue("Test Data");
	await expect(await $("#first_7")).toHaveValue("Test Data");
	await browser.pause(5000);
});

Given(/^I enter email address details in the jotform field$/, async () => {
	const iframe = await $(`iframe`);
	await iframe.waitForExist({ timeout: 20000 });
	await iframe.scrollIntoView();
	await browser.switchToFrame(iframe);
	await expect(await $("#input_4").isExisting()).toBe(true);
	await $("#input_4").addValue("testData@yahoo.co.uk");
	await expect(await $("#input_4")).toHaveValue("testData@yahoo.co.uk");
	await browser.pause(5000);
});
