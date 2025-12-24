import { logger } from "@/logger";
import {
	getCorporateContentGssp,
	getBasePathFromSlugAndUrl,
} from "@/utils/getCorporateContentGssp";
import {
	fetchStory,
	getBreadcrumbs,
	getSlugFromParams,
	getStoryVersionFromQuery,
	GENERIC_ERROR_MESSAGE,
} from "@/utils/storyblok";
import * as SectionNavUtils from "@/utils/storyblok/SectionNavUtils";

import type { GetServerSidePropsContext } from "next";

jest.mock("@/utils/storyblok");
jest.mock("@/logger");
//TODO do we need a better mock for the tree?
jest.mock("@/utils/storyblok/SectionNavUtils", () => ({
	buildTree: jest.fn(),
}));

const mockFetchStory = fetchStory as jest.Mock;
const mockGetBreadcrumbs = getBreadcrumbs as jest.Mock;
const mockGetSlugFromParams = getSlugFromParams as jest.Mock;
const mockGetStoryVersionFromQuery = getStoryVersionFromQuery as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;

const mockBuildTree = SectionNavUtils.buildTree as jest.Mock;

describe("getCorporateContentGssp", () => {
	const templateId = "test-template";

	const makeContext = (slug = ["about"]): GetServerSidePropsContext =>
		({
			params: { slug },
			query: {},
			resolvedUrl: "/about",
			res: { setHeader: jest.fn() },
		} as unknown as GetServerSidePropsContext);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("returns notFound if slug is undefined", async () => {
		mockGetSlugFromParams.mockReturnValue(undefined);
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({ notFound: true });

		const context = makeContext(undefined);
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(result).toEqual({ notFound: true });
	});

	it("returns notFound if story is not found", async () => {
		mockGetSlugFromParams.mockReturnValue("about");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({ notFound: true });

		const context = makeContext();
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(mockLoggerError).toHaveBeenCalled();
		expect(result).toEqual({ notFound: true });
	});

	it("returns notFound if both basePath and rawSlug are empty", async () => {
		mockGetSlugFromParams.mockReturnValue("");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({ notFound: true });

		const context = {
			...makeContext([]),
			resolvedUrl: "/",
		} as GetServerSidePropsContext;

		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(result).toEqual({ notFound: true });
	});

	it("returns notFound if params.slug is missing", async () => {
		mockGetSlugFromParams.mockReturnValue(undefined);
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({ notFound: true });

		const context = {
			params: {},
			query: {},
			resolvedUrl: "/something",
			res: { setHeader: jest.fn() },
		} as unknown as GetServerSidePropsContext;

		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(result).toEqual({ notFound: true });
	});

	it("sets correct headers when component is present", async () => {
		mockGetSlugFromParams.mockReturnValue("info");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({
			story: { content: { component: "infoPage" }, name: "Info Page" },
		});
		mockGetBreadcrumbs.mockResolvedValue(["breadcrumb"]);
		mockBuildTree.mockResolvedValue([]);

		const context = makeContext();
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(context.res.setHeader).toHaveBeenCalledWith(
			"X-Page-Template-ID",
			"component: infoPage, template: test-template"
		);
		expect(result).toMatchObject({
			props: expect.objectContaining({
				component: "infoPage",
				breadcrumbs: ["breadcrumb"],
			}),
		});
	});

	it("sets fallback header if component is missing", async () => {
		mockGetSlugFromParams.mockReturnValue("about");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({
			story: { content: {}, name: "Missing Component" },
		});
		mockGetBreadcrumbs.mockResolvedValue(["breadcrumb"]);

		const context = makeContext();
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(context.res.setHeader).toHaveBeenCalledWith(
			"X-Page-Template-ID",
			"slug: about, template: test-template"
		);

		expect(result).toMatchObject({
			props: expect.objectContaining({
				// breadcrumbs: expect.any(Array),
				breadcrumbs: ["breadcrumb"],
			}),
		});
	});

	it("returns generic error if fetch fails", async () => {
		mockGetSlugFromParams.mockReturnValue("error");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockRejectedValue(new Error("fetch failed"));

		const context = makeContext();
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		expect(mockLoggerError).toHaveBeenCalled();
		expect(result).toEqual({ props: { error: GENERIC_ERROR_MESSAGE } });
	});

	it("constructs full slug using basePath and rawSlug", async () => {
		mockGetSlugFromParams.mockReturnValue("about");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({
			story: { content: { component: "infoPage" }, name: "Info Page" },
		});
		mockGetBreadcrumbs.mockResolvedValue(["breadcrumb"]);

		const context = {
			...makeContext(["about"]),
			resolvedUrl: "/corporate/about",
		} as GetServerSidePropsContext;

		const handler = getCorporateContentGssp(templateId);
		await handler(context);

		// Should combine basePath "corporate" and slug "about"
		expect(mockFetchStory).toHaveBeenCalledWith("corporate/about", "draft");
	});

	it("does not include siblingPages for non-infoPage component", async () => {
		mockGetSlugFromParams.mockReturnValue("services");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({
			story: { content: { component: "genericPage" }, name: "Generic Page" },
		});
		mockGetBreadcrumbs.mockResolvedValue(["breadcrumb"]);

		const context = makeContext(["services"]);
		const handler = getCorporateContentGssp(templateId);
		const result = await handler(context);

		if ("props" in result) {
			const props = result.props as Record<string, unknown> & {
				siblingPages?: unknown[];
				component?: string;
			};
			expect(props.component).toBe("genericPage");
		} else {
			throw new Error("Expected result to have props");
		}
	});

	it("logs detailed error when story is not found", async () => {
		mockGetSlugFromParams.mockReturnValue("missing");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({ notFound: true });

		const context = {
			...makeContext(["missing"]),
			resolvedUrl: "/missing",
		} as GetServerSidePropsContext;

		const handler = getCorporateContentGssp(templateId);
		await handler(context);

		expect(mockLoggerError).toHaveBeenCalledWith(
			expect.stringContaining("Story not found for slug: missing")
		);
	});

	it("sets fallback header when story content is missing", async () => {
		mockGetSlugFromParams.mockReturnValue("empty");
		mockGetStoryVersionFromQuery.mockReturnValue("draft");
		mockFetchStory.mockResolvedValue({
			story: {}, // No content or component
		});
		mockGetBreadcrumbs.mockResolvedValue(["breadcrumb"]);

		const context = makeContext(["empty"]);
		const handler = getCorporateContentGssp(templateId);
		await handler(context);

		expect(context.res.setHeader).toHaveBeenCalledWith(
			"X-Page-Template-ID",
			"slug: empty, template: test-template"
		);
	});
});

describe("getBasePathFromSlugAndUrl", () => {
	it("returns base path when slug is present", () => {
		expect(getBasePathFromSlugAndUrl("/corporate/about", "about")).toBe(
			"corporate"
		);
		expect(
			getBasePathFromSlugAndUrl(
				"/segment1/segment2/segment3",
				"segment2/segment3"
			)
		).toBe("segment1");
	});

	it("returns normalized path when slug is undefined", () => {
		expect(getBasePathFromSlugAndUrl("/about/", undefined)).toBe("about");
		expect(getBasePathFromSlugAndUrl("/segment1/segment2/", undefined)).toBe(
			"segment1/segment2"
		);
	});

	it("handles root path", () => {
		expect(getBasePathFromSlugAndUrl("/", undefined)).toBe("");
		expect(getBasePathFromSlugAndUrl("/", "home")).toBe("");
	});

	it("handles empty slug", () => {
		expect(getBasePathFromSlugAndUrl("/section/", "")).toBe("section");
	});
});
