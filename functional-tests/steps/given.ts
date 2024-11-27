import { Given } from "@wdio/cucumber-framework";

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

Given(/^I click on the news breadcrumb link$/, async () => {
	await waitForDisplayed(".breadcrumbs__crumb:nth-of-type(2)", "");
	await clickElement("click", "selector", ".breadcrumbs__crumb:nth-of-type(2)");
	await pause("2000");
});

Given(/^I click on the blogs breadcrumb link$/, async () => {
	await waitForDisplayed(".breadcrumbs__crumb:nth-child(3)", "");
	await clickElement("click", "selector", ".breadcrumbs__crumb:nth-child(3)");
	await pause("2000");
});

Given(/^I click on the news articles breadcrumb link$/, async () => {
	await waitForDisplayed(".breadcrumbs__crumb:nth-child(3)", "");
	await clickElement("click", "selector", ".breadcrumbs__crumb:nth-child(3)");
	await pause("2000");
});
