import {
	search,
	SearchResultsError,
	SortOrder,
} from "@nice-digital/search-client";

import { logger } from "@/logger";
import sampleData from "@/mockData/search/guidance-published.json";

import { GuidanceListPageProps } from "../GuidanceListPageProps";

import { getGetServerSidePropsFunc } from "./GuidanceListGetServerSideProps";

import type { GetServerSidePropsContext, Redirect } from "next";
import type { ParsedUrlQuery } from "querystring";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("getGetServerSidePropsFunc", () => {
	const getServerSideProps = getGetServerSidePropsFunc({
		defaultSortOrder: SortOrder.dateAscending,
		gstPreFilter: "Published",
		dateFilterLabel: "Last updated date",
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
				"Error loading guidance from search on page /guidance/published?q=test: Some server side error message",
				"Some raw debug response"
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
		let result: { props: GuidanceListPageProps };
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
				props: GuidanceListPageProps;
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
					displayName: "test",
					toggleUrl:
						"/guidance/published?ndt=Guidance&from=2020-07-28&to=2021-06-04",
				},
				{
					displayName: "Last updated date between 28/7/2020 and 4/6/2021",
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
