import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { setInputField } from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

// import scroll from '@nice-digital/wdio-cucumber-steps/lib/support/action/scroll';
// import emailInput from '../check/emailInput';

export async function subscribeNewsletter(): Promise<void> {
	const sectorValue = await $("#input_11");
	const jobRoleValue = await $("#input_12");

	await waitForDisplayed("#input6", "");
	await setInputField("set", "commenttestuser+1@gmail.com", "#input6");
	await pause("1000");

	await waitForDisplayed("#first_15", "");
	await setInputField("set", "comment", "#first_15");
	await pause("1000");

	await waitForDisplayed("#last_15", "");
	await setInputField("set", "user", "#last_15");
	await pause("1000");

	await waitForDisplayed("sectorValue", "");
	await clickElement("click", "selector", "sectorValue");
	await sectorValue.selectByVisibleText("Consultancy");
	await pause("1000");

	await waitForDisplayed("jobRoleValue", "");
	await clickElement("click", "selector", "jobRoleValue");
	await jobRoleValue.selectByVisibleText("Academic");
	await pause("1000");

	await clickElement("click", "selector", "#input_4");
	await pause("1000");
}

export default subscribeNewsletter;
