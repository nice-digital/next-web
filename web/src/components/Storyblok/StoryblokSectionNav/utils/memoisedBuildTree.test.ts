import { ServerResponse } from "http";

import { logger } from "@/logger";

// Mock the config before importing the module under test
const mockConfig = {
	serverRuntimeConfig: {
		cache: {
			sectionNavCacheTTL: 1, // 1 second for tests
		},
	},
};

// Mock the config module
jest.mock("@/config", () => mockConfig);

// Mock Storyblok fetch
jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn().mockResolvedValue([
		{
			slug: "slug",
			name: "Test",
			id: 1,
			parent_id: 0,
			is_folder: false,
			published: true,
		},
	]),
}));

interface MockRes extends Partial<ServerResponse> {
	setHeader?: (k: string, v: string) => ServerResponse;
	_headers: Record<string, string>;
}

const makeRes = (): MockRes => {
	const headers: Record<string, string> = {};
	return {
		setHeader: (k: string, v: string) => {
			headers[k] = v;
			return undefined as unknown as ServerResponse;
		},
		_headers: headers,
	};
};

describe("buildTreeWithOptionalCache SWR", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.spyOn(logger, "warn").mockImplementation(() => jest.fn());
		jest.spyOn(logger, "error").mockImplementation(() => jest.fn());
	});

	it("MISS then HIT within fresh TTL", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");
		const res1 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res1 as ServerResponse);
		expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

		const res2 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res2 as ServerResponse);
		expect(res2._headers["X-Section-Navigation-Cache"]).toBe("HIT");
	});

	it("serves STALE and triggers background refresh after fresh TTL but before stale TTL", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");

		// first call → MISS
		const res1 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res1 as ServerResponse);
		expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

		// artificially advance time to between FRESH_TTL and STALE_TTL
		// FRESH_TTL = 1 second (from mock config), STALE_TTL = 1 second + 60 seconds
		jest.useFakeTimers();
		jest.setSystemTime(Date.now() + 1000 + 10); // Just past fresh TTL

		const res2 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res2 as ServerResponse);
		expect(res2._headers["X-Section-Navigation-Cache"]).toBe("STALE");

		jest.useRealTimers();
	});

	it("REFETCH_AFTER_EXPIRY when beyond stale TTL", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");

		const res1 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res1 as ServerResponse);
		expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

		jest.useFakeTimers();
		// STALE_TTL = 1 second + 60 seconds = 61 seconds
		jest.setSystemTime(Date.now() + 61000 + 10); // Just past stale TTL

		const res2 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res2 as ServerResponse);
		expect(res2._headers["X-Section-Navigation-Cache"]).toBe(
			"REFETCH_AFTER_EXPIRY"
		);

		jest.useRealTimers();
	});

	it("bypasses cache when TTL=0", async () => {
		// Update the mock config to have TTL=0
		mockConfig.serverRuntimeConfig.cache.sectionNavCacheTTL = 0;

		// Clear the module cache to force re-evaluation with new config
		jest.resetModules();

		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");

		const res = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res as ServerResponse);
		expect(res._headers["X-Section-Navigation-Cache"]).toBe("BYPASSED");

		// Reset config for other tests
		mockConfig.serverRuntimeConfig.cache.sectionNavCacheTTL = 1;
	});

	it("always sets BuildTime and Cache-TTL headers", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");
		const res = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res as ServerResponse);

		expect(res._headers).toHaveProperty("X-Section-Navigation-Cache");
		expect(res._headers).toHaveProperty("X-Section-Navigation-BuildTime");
		expect(res._headers["X-Section-Navigation-BuildTime"]).toMatch(/ms$/);
		expect(res._headers).toHaveProperty("X-Section-Navigation-Cache-TTL");
		expect(res._headers["X-Section-Navigation-Cache-TTL"]).toMatch(/s$/);
	});

	describe("Cache cleanup functionality", () => {
		it("should manually clean up expired entries", async () => {
			const { buildTreeWithOptionalCache, manualCleanup, purgeCache } =
				await import("./memoisedBuildTree");

			// Clear any existing cache
			purgeCache();

			// Add some cache entries
			const res1 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res1 as ServerResponse
			);
			expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

			const res2 = makeRes();
			await buildTreeWithOptionalCache(
				2,
				"test2",
				false,
				res2 as ServerResponse
			);
			expect(res2._headers["X-Section-Navigation-Cache"]).toBe("MISS");

			// Verify entries are cached (should be HITs now)
			const res3 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res3 as ServerResponse
			);
			expect(res3._headers["X-Section-Navigation-Cache"]).toBe("HIT");

			// Advance time past STALE_TTL to expire entries
			jest.useFakeTimers();
			jest.setSystemTime(Date.now() + 61000 + 1000); // Past stale TTL

			// Manually trigger cleanup
			const cleanedCount = manualCleanup();
			expect(cleanedCount).toBe(2); // Should clean up 2 expired entries

			jest.useRealTimers();
		});

		it("should not clean up fresh entries during manual cleanup", async () => {
			const { buildTreeWithOptionalCache, manualCleanup, purgeCache } =
				await import("./memoisedBuildTree");

			purgeCache();

			// Add a cache entry
			const res1 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res1 as ServerResponse
			);
			expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

			// Immediately try cleanup (entry should still be fresh)
			const cleanedCount = manualCleanup();
			expect(cleanedCount).toBe(0); // Should not clean any fresh entries

			// Verify entry is still cached
			const res2 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res2 as ServerResponse
			);
			expect(res2._headers["X-Section-Navigation-Cache"]).toBe("HIT");
		});

		it("should clean up expired entry on access", async () => {
			const { buildTreeWithOptionalCache, purgeCache } = await import(
				"./memoisedBuildTree"
			);

			purgeCache();

			// Add a cache entry
			const res1 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res1 as ServerResponse
			);
			expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

			// Access while fresh (should be cache hit)
			const res2 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res2 as ServerResponse
			);
			expect(res2._headers["X-Section-Navigation-Cache"]).toBe("HIT");

			// Advance time past STALE_TTL to expire entry
			jest.useFakeTimers();
			jest.setSystemTime(Date.now() + 61000 + 1000); // Past stale TTL

			// Access expired entry (should refetch and clean up old entry)
			const res3 = makeRes();
			await buildTreeWithOptionalCache(
				1,
				"test1",
				false,
				res3 as ServerResponse
			);
			expect(res3._headers["X-Section-Navigation-Cache"]).toBe(
				"REFETCH_AFTER_EXPIRY"
			);

			jest.useRealTimers();
		});

		it("should stop and start periodic cleanup", async () => {
			const { stopPeriodicCleanup } = await import("./memoisedBuildTree");

			// Should not throw when stopping cleanup
			expect(() => stopPeriodicCleanup()).not.toThrow();
		});
	});
});
