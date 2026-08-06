export async function validateUrl(expectedPath: string): Promise<void> {
	await browser.waitUntil(
		async () => new URL(await browser.getUrl()).pathname === expectedPath,
		{
			timeout: 10000,
			timeoutMsg: `Expected URL path to become "${expectedPath}"`,
		}
	);
}
export default validateUrl;
