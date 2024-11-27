import { expect } from "expect-webdriverio";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkUrl } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkURL.js";
import selectors from "../selectors";

export async function validateUrl(expectedUrl: string): Promise<void> {

	await checkUrl("", expectedUrl)
	await pause("2000");
}
export default validateUrl;
