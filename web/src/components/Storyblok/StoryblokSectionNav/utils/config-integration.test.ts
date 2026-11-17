import { serverRuntimeConfig } from "@/config";

// Avoid real Storyblok calls: buildTree ultimately calls fetchLinks.
jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn().mockResolvedValue([]),
}));

/**
 * Checks that the section nav cache TTL is read from config (default.yml, or an
 * environment/local override) and that the same value reaches the response header.
 */
describe("Configuration Reading Integration Test", () => {
	it("should read sectionNavCacheTTL from runtime config", () => {
		expect(typeof serverRuntimeConfig?.cache?.sectionNavCacheTTL).toBe(
			"number"
		);
	});

	it("should surface the configured TTL via the cache response header", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");

		const headers: Record<string, string> = {};
		const res = {
			setHeader: (key: string, value: string) => {
				headers[key] = value;
			},
		} as unknown as import("http").ServerResponse;

		await buildTreeWithOptionalCache(1, "config-test", false, res);

		const ttlHeader = headers["X-Section-Navigation-Cache-TTL"];
		expect(ttlHeader).toMatch(/^\d+s$/);

		const ttlSeconds = Number(ttlHeader.replace("s", ""));
		expect(ttlSeconds).toBeGreaterThan(0);
		expect(ttlSeconds).toBe(serverRuntimeConfig?.cache?.sectionNavCacheTTL);
	});
});
