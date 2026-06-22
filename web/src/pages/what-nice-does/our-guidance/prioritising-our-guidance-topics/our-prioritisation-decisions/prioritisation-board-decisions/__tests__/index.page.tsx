import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import sampleData from "@/mockData/search/prioritisation.json";
import { render, screen, within } from "@/test-utils/rendering";
import { formatDateStr } from "@/utils/datetime";

import IndexPage from "./../index.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions", () => {
	let container: HTMLElement;
	beforeEach(() => {
		mockDate.set("2025-06-17");

		// eslint-disable-next-line testing-library/no-render-in-setup
		container = render(
			<IndexPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={
					{
						route:
							"/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/prioritisation-board-decisions",
					} as SearchUrl
				}
			/>
		).container;
	});

	it("should match the snapshot", () => {
		expect(container).toMatchSnapshot();
	});

	describe("Table", () => {
		describe("Column headings", () => {
			it.each([
				["Prioritisation board meeting date", 1],
				["Topic title", 2],
				["Prioritisation decision", 3],
				["Rationale", 4],
				["Prioritisation programme", 5],
				["Decision publication date", 6],
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
			const caption = screen.getByText("List of priorition board decisions", {
				selector: "caption",
			});
			expect(caption).toBeInTheDocument();
			expect(caption).toHaveClass("visually-hidden");
		});

		it("should show the number of rows of data supplied", () => {
			expect(screen.getAllByRole("row")).toHaveLength(11); // 11 = 10 rows of data and 1 for the heading row
		});

		describe("First row data", () => {
			const {
				prioritisationBoardMeetingDate,
				title,
				prioritisationDecision,
				metaDescription,
				prioritisationProgramme,
				prioritisationBoardDecisionDate,
			} = sampleData.documents[0];

			it.each([
				[formatDateStr(String(prioritisationBoardMeetingDate))],
				[title],
				[prioritisationDecision],
				[metaDescription],
				[prioritisationProgramme],
				[formatDateStr(String(prioritisationBoardDecisionDate))],
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
					screen.getAllByRole("cell", { name: "21 March 2025" })[0]
				).toBeInTheDocument();
			});
			it("should render the datetime attribute in ISO standard", () => {
				const time = screen
					.getAllByRole("cell", { name: "21 March 2025" })[0]
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("datetime", "2025-03-21T12:00:00");
			});
			it("should render a short version of the date as a data attribute for display on small screens with CSS", () => {
				const time = screen
					.getAllByRole("cell", { name: "21 March 2025" })[0]
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("data-shortdate", "21/3/2025");
			});
		});
	});
});
