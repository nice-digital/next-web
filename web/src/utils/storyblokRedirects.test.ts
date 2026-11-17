import { logger } from "@/logger";
import { fetchStory } from "@/utils/storyblok";
import {
	buildRedirectMap,
	clearRedirectsCache,
	findRedirect,
	getRedirectMap,
	isRedirectsConfigSlug,
	normaliseRedirectPath,
	REDIRECTS_STORY_SLUG,
	REDIRECTS_TTL_MS,
	type RedirectEntryStoryblok,
} from "@/utils/storyblokRedirects";

jest.mock("@/utils/storyblok");
jest.mock("@/logger");

const mockFetchStory = fetchStory as jest.Mock;

const entry = (
	source: string,
	destination: string
): RedirectEntryStoryblok => ({
	source,
	destination,
	component: "redirectEntry",
	_uid: `${source}>${destination}`,
});

const storyWith = (...redirects: RedirectEntryStoryblok[]) => ({
	story: { content: { component: "redirectsConfig", redirects } },
});

describe("storyblokRedirects", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		clearRedirectsCache();
	});

	describe("normaliseRedirectPath", () => {
		it.each([
			["/About-Us/Old-Page", "/about-us/old-page"],
			["/about-us/old-page/", "/about-us/old-page"],
			["  /about-us/old-page  ", "/about-us/old-page"],
			["/about-us/old-page?a=b#c", "/about-us/old-page"],
			["/", "/"],
		])("tidies %s to %s", (path, expected) => {
			expect(normaliseRedirectPath(path)).toBe(expected);
		});

		it.each([
			["https://example.com/page"],
			["//example.com/page"],
			["about-us/old-page"],
			["/about us/old page"],
			[""],
			[undefined],
		])("rejects %s", (path) => {
			expect(normaliseRedirectPath(path)).toBeNull();
		});
	});

	describe("isRedirectsConfigSlug", () => {
		it.each([["site-config"], ["site-config/redirects"], ["/Site-Config/x/"]])(
			"is true for %s",
			(slug) => {
				expect(isRedirectsConfigSlug(slug)).toBe(true);
			}
		);

		it.each([["about-us"], ["site-configuration"], ["about-us/site-config"]])(
			"is false for %s",
			(slug) => {
				expect(isRedirectsConfigSlug(slug)).toBe(false);
			}
		);
	});

	describe("buildRedirectMap", () => {
		it("maps tidied sources to tidied destinations", () => {
			const { map, rejected } = buildRedirectMap([
				entry("/About-Us/Old/", "/about-us/new"),
			]);

			expect(Array.from(map)).toEqual([["/about-us/old", "/about-us/new"]]);
			expect(rejected).toEqual([]);
		});

		it("returns an empty map when there are no entries", () => {
			expect(buildRedirectMap(undefined).map.size).toBe(0);
		});

		it("leaves out both halves of a loop", () => {
			const { map, rejected } = buildRedirectMap([
				entry("/a", "/b"),
				entry("/b", "/a"),
				entry("/c", "/d"),
			]);

			expect(Array.from(map)).toEqual([["/c", "/d"]]);
			expect(rejected).toHaveLength(2);
		});

		it("leaves out a loop that only differs by case or trailing slash", () => {
			const { map } = buildRedirectMap([entry("/a", "/B/"), entry("/b", "/A")]);

			expect(map.size).toBe(0);
		});

		it("leaves out the first hop of a chain but keeps the last", () => {
			const { map, rejected } = buildRedirectMap([
				entry("/a", "/b"),
				entry("/b", "/c"),
			]);

			expect(Array.from(map)).toEqual([["/b", "/c"]]);
			expect(rejected[0]).toMatchObject({ source: "/a" });
		});

		it("leaves out a redirect to itself", () => {
			const { map, rejected } = buildRedirectMap([entry("/a", "/A/")]);

			expect(map.size).toBe(0);
			expect(rejected[0].reason).toBe("source and destination are the same");
		});

		it("keeps the first of two entries with the same source", () => {
			const { map, rejected } = buildRedirectMap([
				entry("/a", "/b"),
				entry("/A", "/c"),
			]);

			expect(map.get("/a")).toBe("/b");
			expect(rejected[0].reason).toBe("duplicate source");
		});

		it("leaves out destinations on other domains", () => {
			const { map, rejected } = buildRedirectMap([
				entry("/a", "https://example.com/b"),
				entry("/c", "//example.com/d"),
			]);

			expect(map.size).toBe(0);
			expect(rejected).toHaveLength(2);
		});

		it("leaves out sources inside the redirects folder", () => {
			const { map } = buildRedirectMap([entry("/site-config/redirects", "/a")]);

			expect(map.size).toBe(0);
		});
	});

	describe("getRedirectMap", () => {
		it("loads the list from the redirects story", async () => {
			mockFetchStory.mockResolvedValue(storyWith(entry("/a", "/b")));

			const map = await getRedirectMap("published");

			expect(mockFetchStory).toHaveBeenCalledWith(
				REDIRECTS_STORY_SLUG,
				"published"
			);
			expect(map.get("/a")).toBe("/b");
		});

		it("keeps the list in memory until it expires", async () => {
			const now = jest.spyOn(Date, "now").mockReturnValue(1000);
			mockFetchStory.mockResolvedValue(storyWith(entry("/a", "/b")));

			await getRedirectMap();
			await getRedirectMap();
			expect(mockFetchStory).toHaveBeenCalledTimes(1);

			now.mockReturnValue(1000 + REDIRECTS_TTL_MS + 1);
			await getRedirectMap();
			expect(mockFetchStory).toHaveBeenCalledTimes(2);

			now.mockRestore();
		});

		it("keeps draft and published lists apart", async () => {
			mockFetchStory.mockResolvedValue(storyWith());

			await getRedirectMap("published");
			await getRedirectMap("draft");

			expect(mockFetchStory).toHaveBeenCalledTimes(2);
		});

		it("returns no redirects when the story doesn't exist", async () => {
			mockFetchStory.mockResolvedValue({ notFound: true });

			expect((await getRedirectMap()).size).toBe(0);
		});

		it("returns no redirects when Storyblok fails first time", async () => {
			mockFetchStory.mockRejectedValue(new Error("Storyblok is down"));

			expect((await getRedirectMap()).size).toBe(0);
			expect(logger.error).toHaveBeenCalled();
		});

		it("carries on with the previous list when Storyblok fails later", async () => {
			const now = jest.spyOn(Date, "now").mockReturnValue(1000);
			mockFetchStory.mockResolvedValueOnce(storyWith(entry("/a", "/b")));
			await getRedirectMap();

			now.mockReturnValue(1000 + REDIRECTS_TTL_MS + 1);
			mockFetchStory.mockRejectedValueOnce(new Error("Storyblok is down"));

			expect((await getRedirectMap()).get("/a")).toBe("/b");

			now.mockRestore();
		});

		it("ignores a story with the wrong content type", async () => {
			mockFetchStory.mockResolvedValue({
				story: { content: { component: "infoPage" } },
			});

			expect((await getRedirectMap()).size).toBe(0);
			expect(logger.error).toHaveBeenCalled();
		});

		it("logs each entry it ignores", async () => {
			mockFetchStory.mockResolvedValue(
				storyWith(entry("/a", "/b"), entry("/b", "/a"))
			);

			await getRedirectMap();

			expect(logger.warn).toHaveBeenCalledTimes(2);
		});
	});

	describe("findRedirect", () => {
		beforeEach(() => {
			mockFetchStory.mockResolvedValue(storyWith(entry("/a", "/b")));
		});

		it("finds a redirect whatever the case or trailing slash", async () => {
			expect(await findRedirect("/A/")).toBe("/b");
		});

		it("logs a hit", async () => {
			await findRedirect("/a");

			expect(logger.info).toHaveBeenCalledWith(
				{ source: "/a", destination: "/b" },
				expect.stringContaining("hit")
			);
		});

		it("returns null when there is no redirect", async () => {
			expect(await findRedirect("/nothing-here")).toBeNull();
			expect(logger.info).not.toHaveBeenCalled();
		});

		it("returns null for a path it can't tidy, without loading the list", async () => {
			expect(await findRedirect("not a path")).toBeNull();
			expect(mockFetchStory).not.toHaveBeenCalled();
		});
	});
});
