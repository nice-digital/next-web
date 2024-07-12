import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { setInputField } from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

import selectors from "../selectors.js";

// import scroll from '@nice-digital/wdio-cucumber-steps/lib/support/action/scroll';
// import emailInput from '../check/emailInput';

export async function subscribeNewsletter(): Promise<void> {
	const sectorValue = await $("#input_11");
	const jobRoleValue = await $("#input_12");

	await waitForDisplayed(selectors.SubscribeToNewsletter.emailAddress, "");
	await setInputField(
		"set",
		"commenttestuser+1@gmail.com",
		selectors.SubscribeToNewsletter.emailAddress
	);

	await pause("1000");
	await waitForDisplayed(
		selectors.SubscribeToNewsletter.firstnameforNewsletter,
		""
	);
	await setInputField(
		"set",
		"comment",
		selectors.SubscribeToNewsletter.firstnameforNewsletter
	);
	await pause("1000");
	await waitForDisplayed(
		selectors.SubscribeToNewsletter.lastnameforNewsletter,
		""
	);
	await setInputField(
		"set",
		"user",
		selectors.SubscribeToNewsletter.lastnameforNewsletter
	);
	await pause("1000");
	await waitForDisplayed(selectors.SubscribeToNewsletter.sector, "");
	await clickElement(
		"click",
		"selector",
		selectors.SubscribeToNewsletter.sector
	);
	await sectorValue.selectByVisibleText("Consultancy");
	await pause("1000");
	await waitForDisplayed(selectors.SubscribeToNewsletter.jobRole, "");
	await clickElement(
		"click",
		"selector",
		selectors.SubscribeToNewsletter.sector
	);
	await jobRoleValue.selectByVisibleText("Academic");
	await pause("1000");
	await clickElement(
		"click",
		"selector",
		selectors.SubscribeToNewsletter.subscribeButton
	);
	await pause("1000");
}

export default subscribeNewsletter;
