import { ParsedUrlQuery } from "querystring";

import { GetServerSidePropsContext, Redirect } from "next";
import { useRouter } from "next/router";

import {
	search,
	SearchResultsError,
	SearchResultsSuccess,
	SearchUrl,
} from "@nice-digital/search-client";

import { logger } from "@/logger";
import { render, screen, within } from "@/test-utils";
import { formatDateStr } from "@/utils/index";

import sampleData from "../../__mocks__/__data__/search/guidance-published.json";

import {
	Published,
	getServerSideProps,
	PublishedGuidancePageProps,
} from "./published.page";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn() },
	useLogger: jest.fn(() => ({ error: jest.fn() })),
}));

describe("/guidance/published", () => {
	let routerPush: jest.Mock;
	beforeEach(() => {
		routerPush = jest.fn();

		(useRouter as jest.Mock).mockImplementation(() => ({
			route: "/",
			pathname: "",
			query: "",
			asPath: "",
			push: routerPush,
		}));

		render(
			<Published
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "/guidance/published" } as SearchUrl}
			/>
		);
	});

	describe("getServerSideProps", () => {
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
			let result: { props: PublishedGuidancePageProps };
			const resolvedUrl =
				"/guidance/published?q=test&ndt=Guidance&from=2020-07-28&to=2021-06-04";
			beforeEach(async () => {
				(search as jest.Mock).mockResolvedValue(sampleData);

				result = (await getServerSideProps({
					resolvedUrl,
				} as GetServerSidePropsContext)) as {
					props: PublishedGuidancePageProps;
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
						displayName: "Last updated between 28/7/2020 and 4/6/2021",
						toggleUrl:
							"/guidance/published?s=Date&ps=10&q=test&ndt=Guidance&gst=Published",
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
					gst: "Published",
					ndt: "Guidance",
					s: "Date",
					ps: 10,
				});
			});
		});
	});

	describe("Skip links", () => {
		it("should render skip link to filters", () => {
			expect(
				screen.getByRole("link", { name: "Skip to filters" })
			).toHaveAttribute("href", "#filters");
		});

		it("should render two skip links to results", () => {
			const resultsSkipLinks = screen.getAllByRole("link", {
				name: "Skip to results",
			});
			expect(resultsSkipLinks[0]).toHaveAttribute("href", "#results");
			expect(resultsSkipLinks[1]).toHaveAttribute("href", "#results");
		});
	});

	describe("Table", () => {
		it("should add skip link target id to results table", () => {
			expect(screen.getByRole("table")).toHaveProperty("id", "results");
		});

		describe("Column headings", () => {
			it.each([
				["Title", 1],
				["Reference number", 2],
				["Published", 3],
				["Last updated", 4],
			])(
				"should set column header '%s' at column %i",
				(headingText, columnIndex) => {
					expect(
						screen.getByText(headingText, {
							selector: `th:nth-child(${columnIndex})`,
						})
					).toBeInTheDocument();
				}
			);
		});

		it("should have a caption describing the content of the table", () => {
			expect(
				screen.getByText("Published guidance, quality standards and advice", {
					selector: "caption",
				})
			).toBeInTheDocument();
		});

		it("should have a visually hidden caption", () => {
			expect(
				screen.getByText("Published guidance, quality standards and advice", {
					selector: "caption",
				})
			).toHaveClass("visually-hidden");
		});

		it("should show the number of rows of data supplied", () => {
			expect(screen.getAllByRole("row")).toHaveLength(3); // 3 = 2 rows of data and 1 for the heading row
		});

		describe("First row data", () => {
			const { title, guidanceRef, publicationDate, lastUpdated } =
				sampleData.documents[0];
			it.each([
				[title],
				[guidanceRef],
				[formatDateStr(String(publicationDate))],
				[formatDateStr(String(lastUpdated))],
			])("should set data cell to '%s'", (text) => {
				const row = screen.getAllByRole("row")[1];
				expect(
					within(row).getByRole("cell", { name: text })
				).toBeInTheDocument();
			});
		});

		describe("Date formatting", () => {
			it("should render the date in the NICE style format", () => {
				expect(
					screen.getByRole("cell", { name: /4 september 2021/i })
				).toBeInTheDocument();
			});
			it("should render the datetime attribute in ISO standard", () => {
				const time = screen
					.getByRole("cell", { name: /4 september 2021/i })
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("datetime", "2021-09-04T12:00:00");
			});
			it("should render a short version of the date as a data attribute for display on small screens with CSS", () => {
				const time = screen
					.getByRole("cell", { name: /4 september 2021/i })
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("data-shortdate", "4/9/2021");
			});
		});

		it("should match the snapshot", () => {
			expect(screen.getByRole("table")).toMatchSnapshot();
		});
	});
});
