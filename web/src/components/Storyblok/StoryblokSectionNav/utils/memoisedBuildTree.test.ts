import { ServerResponse } from "http";

import { logger } from "@/logger";

// Statically import sectionNavCacheTTL_MS for the sleep
import { sectionNavCacheTTL_MS } from "./memoisedBuildTree";

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

// Default TTL = 1 second
jest.mock("@/config", () => ({
	serverRuntimeConfig: { cache: { sectionNavCacheTTL: 1 } },
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

// const slug = "test-slug";

describe("URL utils", () => {
	beforeEach(() => {
		// ensure fresh module scope for each test
		jest.resetModules();
		jest.spyOn(logger, "warn").mockImplementation(() => jest.fn());
	});

	it("MISS then HIT without expiry", async () => {
		const { buildTreeWithOptionalCache } = await import("./memoisedBuildTree");
		const res1 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res1 as ServerResponse);
		expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

		const res2 = makeRes();
		await buildTreeWithOptionalCache(1, "slug", false, res2 as ServerResponse);
		expect(res2._headers["X-Section-Navigation-Cache"]).toBe("HIT");
	});

	it("expires after TTL", async () => {
		// Load module A and call → MISS
		const modA = await import("./memoisedBuildTree");
		const firstCall = modA.buildTreeWithOptionalCache;
		const resA = makeRes();
		await firstCall(1, "slug", false, resA as ServerResponse);
		expect(resA._headers["X-Section-Navigation-Cache"]).toBe("MISS");

		// Wait past TTL
		await new Promise((r) => setTimeout(r, sectionNavCacheTTL_MS + 20));

		// Reset modules (clears both fake-mem and timestamps)
		jest.resetModules();
		jest.spyOn(logger, "warn").mockImplementation(() => jest.fn());

		// Load module B and call again → MISS
		const modB = await import("./memoisedBuildTree");
		const secondCall = modB.buildTreeWithOptionalCache;
		const resB = makeRes();
		await secondCall(1, "slug", false, resB as ServerResponse);
		expect(resB._headers["X-Section-Navigation-Cache"]).toBe("MISS");
	});

	it("bypasses cache when TTL=0", async () => {
		// locally force TTL = 0
		jest.doMock("@/config", () => ({
			serverRuntimeConfig: { cache: { sectionNavCacheTTL: 0 } },
		}));
		jest.resetModules();
		const { buildTreeWithOptionalCache: bypassed } = await import(
			"./memoisedBuildTree"
		);

		const res = makeRes();
		await bypassed(1, "slug", false, res as ServerResponse);
		expect(res._headers["X-Section-Navigation-Cache"]).toBe("BYPASSED");
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
});
