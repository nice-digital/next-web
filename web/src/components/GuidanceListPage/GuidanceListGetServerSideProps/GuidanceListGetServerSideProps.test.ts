import {
	search,
	SearchResultsError,
	SortOrder,
} from "@nice-digital/search-client";

import { logger } from "@/logger";

import sampleData from "../../../__mocks__/__data__/search/guidance-published.json";
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
				res: {},
			} as GetServerSidePropsContext);

			expect(logger.error as jest.Mock).toHaveBeenCalledWith(
				"Error loading guidance from search on page /guidance/published?q=test: Some server side error message",
				"Some raw debug response"
			);
		});

		it("should return 500 response status when search request fails", async () => {
			const res = { statusCode: 0 };

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
		beforeEach(async () => {
			(search as jest.Mock).mockResolvedValue(sampleData);

			result = (await getServerSideProps({
				resolvedUrl,
			} as GetServerSidePropsContext)) as {
				props: GuidanceListPageProps;
			};
		});

		it("should return results from search in results prop", async () => {
			expect(result.props.results).toBe(sampleData);
		});

		it.todo(
			"should insert from/to dates as first active modifier with correct toggle url"
		);

		it("should set active modifiers from navigators and form/to dates", () => {
			expect(result.props.activeModifiers).toStrictEqual([
				{
					displayName: "Last updated date between 28/7/2020 and 4/6/2021",
					toggleUrl: "/guidance/published?q=test&ndt=Guidance&sp=on",
				},
				{
					displayName: "Type: Guidance",
					toggleUrl:
						"/guidance/published?gst=Published&ngt=NICE%20guidelines&sp=on",
				},
				{
					displayName: "Guidance programme: NICE guidelines",
					toggleUrl: "/guidance/published?gst=Published&ndt=Guidance&sp=on",
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
