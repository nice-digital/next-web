import { Given } from "@wdio/cucumber-framework";
import { expect } from "expect-webdriverio";

import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import {
	indicatorFilter,
	indicatorFilterDate,
} from "../support/action/indicatorFilter.js";
import { getPath, PageName } from "../support/pagePaths.js";

/**
 * Accept all cookies using the NICE cookie banner.
 * We use this as the cookie banner blocks clicks.
 */
export async function acceptCookieBanner(): Promise<void> {
	// The cookie banner (and license key) load async from the CDN
	// so we need to wait for it to load
	const cookieBannerElement = await $("body #ccc");
	await cookieBannerElement.waitForExist({ timeout: 2000 });

	const acceptCookiesButtonElement = await cookieBannerElement.$(
		"button.ccc-accept-button"
	);

	// If cookies have already been chosen then the accept button doesn't show
	if (await acceptCookiesButtonElement.isDisplayed()) {
		await acceptCookiesButtonElement.click();
	}
}

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
	await pause("2000");
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
	await browser.pause(5000);
});

Given(/^I enter email address details in the jotform field$/, async () => {
	const iframe = await $(`iframe`);
	await iframe.waitForExist({ timeout: 20000 });
	await iframe.scrollIntoView();
	await browser.switchToFrame(iframe);
	await expect(await $("#input_4").isExisting()).toBe(true);
	await $("#input_4").addValue("testData@yahoo.co.uk");
	await browser.pause(5000);
});
