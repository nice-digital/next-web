import { useRouter } from "next/router";

import {
	SearchResultsSuccess,
	SearchUrl,
} from "@nice-digital/search-client/types";

import { render, screen, within } from "@/test-utils";
import { formatDateStr } from "@/utils/index";

import sampleData from "../../__mocks__/__data__/search/guidance-published.json";

import { Published } from "./published.page";

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
				searchUrl={{} as SearchUrl}
			/>
		);
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
