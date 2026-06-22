import {
	search,
	SearchResultsError,
	SortOrder,
} from "@nice-digital/search-client";

import { logger } from "@/logger";
import sampleData from "@/mockData/search/prioritisation.json"; // here

import { PrioritisationListPageProps } from "../PrioritisationListPageProps";

import { getGetServerSidePropsFunc } from "./PrioritisationListGetServerSideProps";

import type { GetServerSidePropsContext } from "next";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("getGetServerSidePropsFunc", () => {
	const getServerSideProps = getGetServerSidePropsFunc({
		defaultSortOrder: SortOrder.dateDescending,
		dateFilterLabel: "Prioritisation board meeting date",
		index: "prioritisation",
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
				resolvedUrl:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?q=diabetes",
				res: {
					setHeader: jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
				},
			} as GetServerSidePropsContext);

			expect(logger.error as jest.Mock).toHaveBeenCalledWith(
				"Error loading guidance from search on page /what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?q=diabetes: Some server side error message",
				"Some raw debug response"
			);
		});

		it("should return 500 response status when search request fails", async () => {
			const res = {
				statusCode: 0,
				setHeader: jest.fn() as GetServerSidePropsContext["res"]["setHeader"],
			};

			await getServerSideProps({
				resolvedUrl:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?q=diabetes",
				res,
			} as GetServerSidePropsContext);

			expect(res.statusCode).toBe(500);
		});
	});

	describe("Success", () => {
		let result: { props: PrioritisationListPageProps };
		const resolvedUrl =
			"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?q=diabetes&from=2026-01-01&to=2026-06-22&ppr=Guidelines";
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
				props: PrioritisationListPageProps;
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
					displayName: "Topic title: diabetes",
					toggleUrl:
						"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?q=diabetes",
				},
				{
					displayName:
						"Prioritisation board meeting date between: 1/1/2026 and 22/6/2026",
					toggleUrl:
						"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?from=2026-01-01&to=2026-06-22",
				},
				{
					displayName: "Prioritisation decision: NotSelected",
					toggleUrl:
						"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?pde=NotSelected",
				},
				{
					displayName: "Prioritisation programme: Guidelines",
					toggleUrl:
						"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions?ppr=Guidelines",
				},
			]);
		});

		it("should return search url prop", async () => {
			expect(result.props.searchUrl).toStrictEqual({
				route:
					"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions",
				q: "diabetes",
				from: "2026-01-01",
				to: "2026-06-22",
				fullUrl: resolvedUrl,
				ppr: "Guidelines",
			});
		});
	});
});
