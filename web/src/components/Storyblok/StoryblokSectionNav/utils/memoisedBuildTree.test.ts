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

// 1) Fake-mem: first call caches, subsequent return cached value
jest.mock("mem", () => (fn: any) => {
  const cache = new Map<string, any>();
  return async (...args: any[]) => {
    const key = args.join("_");
    if (cache.has(key)) {
      return cache.get(key);
    }
    const out = await fn(...args);
    cache.set(key, out);
    return out;
  };
});

// 2) Default TTL = 1 second
jest.mock("@/config", () => ({
  serverRuntimeConfig: { cache: { sectionNavCacheTTL: 1 } },
}));

import { logger } from "@/logger";
import type { GetServerSidePropsContext } from "next";

// Statically import sectionNavCacheTTL_MS for the sleep
import { sectionNavCacheTTL_MS } from "./memoisedBuildTree";

const makeRes = () => {
  const headers: Record<string, string> = {};
  return {
    setHeader: (k: string, v: string) => (headers[k] = v),
    _headers: headers,
  };
};

describe("buildTreeWithOptionalCache (integration-style)", () => {
  beforeEach(() => {
    // ensure fresh module scope for each test
    jest.resetModules();
    jest.spyOn(logger, "warn").mockImplementation(() => {});
  });

  it("MISS then HIT without expiry", async () => {
    const { buildTreeWithOptionalCache } = require("./memoisedBuildTree");
    const res1 = makeRes();
    await buildTreeWithOptionalCache(1, "slug", false, res1 as any);
    expect(res1._headers["X-Section-Navigation-Cache"]).toBe("MISS");

    const res2 = makeRes();
    await buildTreeWithOptionalCache(1, "slug", false, res2 as any);
    expect(res2._headers["X-Section-Navigation-Cache"]).toBe("HIT");
  });

  it("expires after TTL", async () => {
    // 1) Load module A and call → MISS
    const modA = require("./memoisedBuildTree");
    const firstCall = modA.buildTreeWithOptionalCache;
    const resA = makeRes();
    await firstCall(1, "slug", false, resA as any);
    expect(resA._headers["X-Section-Navigation-Cache"]).toBe("MISS");

    // 2) Wait past TTL
    await new Promise((r) => setTimeout(r, sectionNavCacheTTL_MS + 20));

    // 3) Reset modules (clears both fake-mem and timestamps)
    jest.resetModules();
    jest.spyOn(logger, "warn").mockImplementation(() => {});

    // 4) Load module B and call again → MISS
    const modB = require("./memoisedBuildTree");
    const secondCall = modB.buildTreeWithOptionalCache;
    const resB = makeRes();
    await secondCall(1, "slug", false, resB as any);
    expect(resB._headers["X-Section-Navigation-Cache"]).toBe("MISS");
  });

  it("bypasses cache when TTL=0", async () => {
    // locally force TTL = 0
    jest.doMock("@/config", () => ({
      serverRuntimeConfig: { cache: { sectionNavCacheTTL: 0 } },
    }));
    jest.resetModules();
    const { buildTreeWithOptionalCache: bypassed } =
      require("./memoisedBuildTree");

    const res = makeRes();
    await bypassed(1, "slug", false, res as any);
    expect(res._headers["X-Section-Navigation-Cache"]).toBe("BYPASSED");
  });

  it("always sets BuildTime and Cache-TTL headers", async () => {
    const { buildTreeWithOptionalCache } = require("./memoisedBuildTree");
    const res = makeRes();
    await buildTreeWithOptionalCache(1, "slug", false, res as any);

    expect(res._headers).toHaveProperty("X-Section-Navigation-Cache");
    expect(res._headers).toHaveProperty("X-Section-Navigation-BuildTime");
    expect(res._headers["X-Section-Navigation-BuildTime"]).toMatch(/ms$/);
    expect(res._headers).toHaveProperty("X-Section-Navigation-Cache-TTL");
    expect(res._headers["X-Section-Navigation-Cache-TTL"]).toMatch(/s$/);
  });
});
