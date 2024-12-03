import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import selectors from "../selectors.js";

export async function clickSignInButton(): Promise<void> {
	await waitForDisplayed(selectors.home.signInButton, "");
	await clickElement("click", "selector", selectors.home.signInButton);
	await pause("2000");
}

export async function clickSignUpButton(): Promise<void> {
	await waitForDisplayed(
		selectors.newsBlogsPodcasts.newsletterSignUpButton,
		""
	);
	await clickElement(
		"click",
		"selector",
		selectors.newsBlogsPodcasts.newsletterSignUpButton
	);
	await pause("2000");
}
export default clickSignInButton;
