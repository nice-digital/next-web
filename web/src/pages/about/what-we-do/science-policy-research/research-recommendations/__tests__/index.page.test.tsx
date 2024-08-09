import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import sampleData from "@/mockData/search/researchrecs-published.json";
import { render, screen, within } from "@/test-utils/rendering";
import { formatDateStr } from "@/utils/datetime";

import PublishedPage from "../index.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/research-recommendations/index", () => {
	let container: HTMLElement;
	beforeEach(() => {
		mockDate.set("2020-11-22");

		// eslint-disable-next-line testing-library/no-render-in-setup
		container = render(
			<PublishedPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "research-recommendations/index" } as SearchUrl}
			/>
		).container;
	});

	it("should match the snapshot", () => {
		expect(container).toMatchSnapshot();
	});

	describe("Table", () => {
		describe("Column headings", () => {
			it.each([
				["Reference number", 1],
				["Recommendation for research", 2],
				["Published date", 3],
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

		it("should have a visually hidden caption describing the content of the table", () => {
			const caption = screen.getByText("List of research recommendations", {
				selector: "caption",
			});
			expect(caption).toBeInTheDocument();
			expect(caption).toHaveClass("visually-hidden");
		});

		it("should show the number of rows of data supplied", () => {
			expect(screen.getAllByRole("row")).toHaveLength(11); // 11 = 10 rows of data and 1 for the heading row
		});

		describe("First row data", () => {
			const { guidanceRef, title, publicationDate } = sampleData.documents[0];
			it.each([
				[guidanceRef],
				[title],
				[formatDateStr(String(publicationDate))],
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
					screen.getAllByRole("cell", { name: /26 February 2024/i })[0]
				).toBeInTheDocument();
			});
			it("should render the datetime attribute in ISO standard", () => {
				const time = screen
					.getAllByRole("cell", { name: /26 February 2024/i })[0]
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("datetime", "2024-02-26T12:00:00");
			});
			it("should render a short version of the date as a data attribute for display on small screens with CSS", () => {
				const time = screen
					.getAllByRole("cell", { name: /26 February 2024/i })[0]
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("data-shortdate", "26/2/2024");
			});
		});
	});
});
