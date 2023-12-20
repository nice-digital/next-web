// import { Given } from "@cucumber/cucumber";
import { Given } from "@wdio/cucumber-framework";

// import { acceptCookieBanner } from "@nice-digital/wdio-cucumber-steps/lib/support/action/acceptCookieBanner";
// import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";

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

// import { getPath, PageName } from "../support/pagePaths";

export const pagePaths = {
	"published guidance list": "/guidance/published",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	"awaiting development guidance list": "/guidance/awaiting-development",
	status: "/status",
	"published indicators list": "/indicators/published",
	"IND63 overview":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment",
} as const;

export type PageName = keyof typeof pagePaths;

export const getPath = (pageName: PageName): string => {
	const path = pagePaths[pageName];

	if (!path) throw `Path for page ${pageName} could not be resolved`;

	return path;
};

Given(/^I open the (.*) page$/, async (pageName: PageName) => {
	await openWebsite("url", getPath(pageName));

	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	await acceptCookieBanner();
});
