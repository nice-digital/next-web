import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { checkUrl } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkURL.js";

export async function validateUrl(expectedUrl: string): Promise<void> {
	await checkUrl("", expectedUrl);
	await pause("2000");
}
export default validateUrl;
