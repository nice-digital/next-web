/**
 * Dismiss the NICE cookie banner, which blocks clicks while it's up.
 *
 * Civic loads the banner from a CDN and verifies a licence key over the
 * network, so we still give it a moment to appear - but a third party blip
 * means the element never shows at all, and nothing is blocking clicks in that
 * case, so there's nothing to fail about. Matches the bnf-gatsby and cks-gatsby
 * helpers, which return quietly rather than throwing.
 *
 * The wait is kept (unlike BNF and CKS, which drop it) because those repos call
 * waitForReact() before this and next-web has no equivalent settle step: the
 * page-open step goes straight from browser.url() to here, so without it we'd
 * risk looking before the banner has rendered and leaving it up to block clicks.
 */
export async function acceptCookieBanner(): Promise<void> {
	const cookieBannerElement = await $("body #ccc");

	try {
		await cookieBannerElement.waitForExist({ timeout: 2000 });
	} catch {
		return;
	}

	const acceptCookiesButtonElement = await cookieBannerElement.$(
		"button.ccc-accept-button"
	);

	// If cookies have already been chosen then the accept button doesn't show
	if (await acceptCookiesButtonElement.isDisplayed()) {
		await acceptCookiesButtonElement.click();
	}
}
