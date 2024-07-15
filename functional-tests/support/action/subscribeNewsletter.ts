import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";

export async function subscribeNewsletter(): Promise<void> {
	const sectorValue = await $("#input_11");
	const jobRoleValue = await $("#input_12");
	const emailValue = await $("#input_6");
	const firstNameValue = await $("#first_15");
	const lastNameValue = await $("#last_15");
	const subscribeButtonValue = await $("#input_4");

	await emailValue.waitForDisplayed();
	await emailValue.addValue("commenttestuser+1@gmail.com");
	await pause("1000");

	await firstNameValue.waitForDisplayed();
	await firstNameValue.addValue("comment");
	await pause("1000");

	await lastNameValue.waitForDisplayed();
	await lastNameValue.addValue("user");
	await pause("1000");

	await sectorValue.waitForDisplayed();
	await sectorValue.click();
	await sectorValue.selectByVisibleText("Consultancy");
	await pause("1000");

	await jobRoleValue.waitForDisplayed();
	await jobRoleValue.click();
	await jobRoleValue.selectByVisibleText("Academic");
	await pause("1000");

	await subscribeButtonValue.click();
	await pause("1000");
}

export default subscribeNewsletter;
