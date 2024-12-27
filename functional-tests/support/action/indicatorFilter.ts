import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { setInputField } from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";

export async function indicatorFilter(filterTerm: string): Promise<void> {
	await waitForDisplayed(".input__input:nth-child(1)", "");
	await setInputField("add", filterTerm, ".input__input:nth-child(1)");
	await pause("2000");
	await clickElement("click", "button", ".btn--secondary:nth-child(2)");
	await pause("2000");
}

export async function indicatorFilterDate(
	filterFromDate: string
): Promise<void> {
	await waitForDisplayed("#from", "");
	await setInputField("add", filterFromDate, "#from");
	await pause("2000");
	await clickElement("click", "button", ".btn--secondary:nth-child(3)");

	// await pause("2000");

	// const elem = await $(".horizontal-nav__list:nth-child(1)");
	// await elem.scrollIntoView({ block: "center", inline: "center" });
}

export default indicatorFilter;
