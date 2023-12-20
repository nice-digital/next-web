import { Given } from "@wdio/cucumber-framework";

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

import { getPath, PageName } from "../support/pagePaths.js";

Given(/^I open the (.*) page$/, async (pageName: PageName) => {
	await openWebsite("url", getPath(pageName));

	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	await acceptCookieBanner();
});
