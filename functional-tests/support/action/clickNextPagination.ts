import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import selectors from "../selectors.js";

export async function clickNextPagination(): Promise<void> {
	await waitForDisplayed(selectors.indicatorsPage.nextPager, "");
	await clickElement("click", "selector", selectors.indicatorsPage.nextPager);
	await pause("2000");
}

export default clickNextPagination;
