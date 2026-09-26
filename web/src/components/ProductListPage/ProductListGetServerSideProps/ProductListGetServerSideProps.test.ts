import {
	search,
	SearchResultsError,
	SortOrder,
} from "@nice-digital/search-client";

import { logger } from "@/logger";
import sampleData from "@/mockData/search/guidance-published.json";

import { ProductListPageProps } from "../ProductListPageProps";

import { getGetServerSidePropsFunc } from "./ProductListGetServerSideProps";

import type { GetServerSidePropsContext, Redirect } from "next";
import type { ParsedUrlQuery } from "querystring";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("getGetServerSidePropsFunc", () => {
	const getServerSideProps = getGetServerSidePropsFunc({
		defaultSortOrder: SortOrder.dateDescending,
		gstPreFilter: "Published",
		dateFilterLabel: "Last updated date",
		index: "guidance",
	});

	describe("Redirects", () => {
		it("should return permanent redirect object from old page style URL to new style URL", async () => {
			const redirectResult = (await getServerSideProps({
				resolvedUrl: "/guidance/published?title=test",
				query: {
					title: "test",
				} as ParsedUrlQuery,
			} as GetServerSidePropsContext)) as {
				redirect: Redirect;
			};

			expect(redirectResult).toStrictEqual({
				redirect: {
					destination: "/guidance/published?q=test",
					permanent: true,
				},
			});
		});
	});

	describe("Query sanitisation", () => {
		beforeEach(() => {
			(search as jest.Mock).mockResolvedValue(sampleData);
		});

		const getRedirect = async (resolvedUrl: string) =>
			(
				(await getServerSideProps({
					resolvedUrl,
					query: {} as ParsedUrlQuery,
					res: {
						setHeader:
							jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
					},
				} as GetServerSidePropsContext)) as { redirect?: Redirect }
			).redirect;

		it.each([
			[
				"clamps ps down to the largest allowed size, never up",
				"?q=test&ps=9998",
				"?q=test&ps=50",
			],
			["clamps ps down to an allowed size", "?q=test&ps=30", "?q=test&ps=25"],
			["never rounds ps up to a bigger size", "?q=test&ps=40", "?q=test&ps=25"],
			["drops ps below the smallest allowed size", "?q=test&ps=5", "?q=test"],
			["drops default page size", "?q=test&ps=10", "?q=test"],
			["drops non-numeric ps", "?ps=abc&q=test", "?q=test"],
			["drops out-of-range page numbers", "?q=test&pa=99999", "?q=test"],
			["drops non-numeric pa", "?q=test&pa=abc", "?q=test"],
			["strips save-all-results", "?q=test&sa=true", "?q=test"],
			["strips aggsOnly", "?aggsOnly=true&q=test", "?q=test"],
			["strips expensive params entirely", "?sa=true", ""],
			["collapses duplicate ps", "?q=test&ps=25&ps=9999", "?q=test&ps=25"],
			["collapses duplicate pa", "?q=test&pa=1&pa=99999", "?q=test&pa=1"],
		])("should temporarily redirect: %s", async (_label, query, expected) => {
			expect(await getRedirect(`/guidance/published${query}`)).toStrictEqual({
				destination: `/guidance/published${expected}`,
				permanent: false,
			});
		});

		it.each([
			["a bare list page URL", "/guidance/published"],
			["an allowed page size", "/guidance/published?q=test&ps=25"],
			["the largest allowed page size", "/guidance/published?q=test&ps=9999"],
			["a page within the result window", "/guidance/published?pa=100"],
			[
				"UI-generated URLs with encoded facet values",
				"/guidance/published?q=test&ndt=Guidance&ngt=NICE%20guidelines",
			],
		])("should not redirect %s", async (_label, resolvedUrl) => {
			expect(await getRedirect(resolvedUrl)).toBeUndefined();
		});

		it("should not redirect the URL it redirects to", async () => {
			const { destination } = (await getRedirect(
				"/guidance/published?q=test&ps=9998&sa=true"
			)) as Redirect;

			expect(await getRedirect(destination)).toBeUndefined();
		});
	});

	describe("Error", () => {
		beforeEach(() => {
			(search as jest.Mock).mockResolvedValue({
				failed: true,
				errorMessage: "Some server side error message",
				debug: { rawResponse: "Some raw debug response" },
			} as SearchResultsError);
		});

		it("should log error and debug response on search failure", async () => {
			await getServerSideProps({
				resolvedUrl: "/guidance/published?q=test",
				res: {
					setHeader: jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
				},
			} as GetServerSidePropsContext);

			expect(logger.error as jest.Mock).toHaveBeenCalledWith(
				{ rawResponse: "Some raw debug response" },
				"Error loading guidance from search on page /guidance/published?q=test: Some server side error message"
			);
		});

		it("should return 500 response status when search request fails", async () => {
			const res = {
				statusCode: 0,
				setHeader: jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
			};

			await getServerSideProps({
				resolvedUrl: "/guidance/published?q=test",
				res,
			} as GetServerSidePropsContext);

			expect(res.statusCode).toBe(500);
		});
	});

	describe("Success", () => {
		let result: { props: ProductListPageProps };
		const resolvedUrl =
			"/guidance/published?q=test&ndt=Guidance&from=2020-07-28&to=2021-06-04";
		const setHeader = jest.fn();
		beforeEach(async () => {
			(search as jest.Mock).mockImplementation(
				() =>
					new Promise((resolve) => setTimeout(() => resolve(sampleData), 11))
			);

			result = (await getServerSideProps({
				res: {
					setHeader: setHeader as GetServerSidePropsContext["res"]["setHeader"],
				},
				resolvedUrl,
			} as GetServerSidePropsContext)) as {
				props: ProductListPageProps;
			};
		});

		it("should set server timing header with search response time", async () => {
			expect(setHeader).toHaveBeenCalledWith(
				"Server-Timing",
				// Can't assert on the actual time because it's not precise every time
				expect.stringMatching(/^search;dur=\d{2,}$/)
			);
		});

		it("should return results from search in results prop", async () => {
			expect(result.props.results).toBe(sampleData);
		});

		it("should set active modifiers from navigators and from/to dates and q title query", () => {
			expect(result.props.activeModifiers).toStrictEqual([
				{
					displayName: "Keyword or reference number: test",
					toggleUrl:
						"/guidance/published?ndt=Guidance&from=2020-07-28&to=2021-06-04",
				},
				{
					displayName: "Last updated date between: 28/7/2020 and 4/6/2021",
					toggleUrl: "/guidance/published?q=test&ndt=Guidance&sp=on",
				},
				{
					displayName: "Type: Guidance",
					toggleUrl: "/guidance/published?sp=on&ngt=NICE%20guidelines",
				},
				{
					displayName: "Guidance programme: NICE guidelines",
					toggleUrl: "/guidance/published?sp=on&ndt=Guidance",
				},
			]);
		});

		it("should return search url prop", async () => {
			expect(result.props.searchUrl).toStrictEqual({
				route: "/guidance/published",
				q: "test",
				from: "2020-07-28",
				to: "2021-06-04",
				fullUrl: resolvedUrl,
				ndt: "Guidance",
			});
		});
	});
});
