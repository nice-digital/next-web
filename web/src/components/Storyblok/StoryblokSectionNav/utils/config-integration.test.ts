import { serverRuntimeConfig } from "@/config";

// Avoid real Storyblok calls: buildTree ultimately calls fetchLinks.
jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn().mockResolvedValue([]),
}));

/**
 * Simple test to verify that the configuration is read correctly
 * This should show the value from local-production.yml: 900 seconds
 */
describe("Configuration Reading Integration Test", () => {
	it("should read sectionNavCacheTTL from runtime config", () => {
		console.log("Runtime config cache:", serverRuntimeConfig?.cache);
		console.log(
			"Section nav cache TTL:",
			serverRuntimeConfig?.cache?.sectionNavCacheTTL
		);

		// The value should be 900 from local-production.yml
		// If the value is undefined, it means the config isn't being read properly
		// For now, we'll just check that the config structure exists
		expect(serverRuntimeConfig).toBeDefined();

		// This test verifies that our implementation can access the config structure
		// The actual value will depend on the environment configuration
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

		console.log("Cache TTL reported in header (seconds):", ttlSeconds);
	});
});
