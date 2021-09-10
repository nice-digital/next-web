import { SearchResultsSuccess } from "@nice-digital/search-client/types";

import { render, screen, within } from "@/test-utils";
import { formatDateStr } from "@/utils/index";

import sampleData from "./__mocks__/published.sample.json";
import { Published } from "./published.page";

jest.mock("next/router", () => ({
	useRouter() {
		return {
			route: "/",
			pathname: "",
			query: "",
			asPath: "",
		};
	},
}));

describe("/guidance/published", () => {
	describe("Table", () => {
		beforeEach(() => {
			render(
				<Published
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
				/>
			);
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
			expect(screen.getAllByRole("row")).toHaveLength(3); // 11 = 10 rows of data and 1 for the heading row
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
					.querySelector("time");
				expect(time).toHaveAttribute("datetime", "2021-09-04T12:00:00");
			});
			it("should render a short version of the date as a data attribute for display on small screens with CSS", () => {
				const time = screen
					.getByRole("cell", { name: /4 september 2021/i })
					.querySelector("time");
				expect(time).toHaveAttribute("data-shortdate", "4/9/2021");
			});
		});

		it("should match the snapshot", () => {
			expect(screen.getByRole("table")).toMatchSnapshot();
		});
	});
});
