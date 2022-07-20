import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import { render, screen, within } from "@/test-utils";
import { formatDateStr } from "@/utils/index";

import sampleData from "../../../__mocks__/__data__/search/guidance-published.json";

import PublishedPage from "./../published.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/guidance/published", () => {
	let container: HTMLElement;
	beforeEach(() => {
		mockDate.set("2020-11-22");

		// eslint-disable-next-line testing-library/no-render-in-setup
		container = render(
			<PublishedPage
				activeModifiers={[]}
				results={sampleData as unknown as SearchResultsSuccess}
				searchUrl={{ route: "/guidance/published" } as SearchUrl}
			/>
		).container;
	});

	it("should match the snapshot", () => {
		expect(container).toMatchSnapshot();
	});

	describe("Table", () => {
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

		it("should have a visually hidden caption describing the content of the table", () => {
			const caption = screen.getByText(
				"Published guidance, NICE advice and quality standards",
				{
					selector: "caption",
				}
			);
			expect(caption).toBeInTheDocument();
			expect(caption).toHaveClass("visually-hidden");
		});

		it("should show the number of rows of data supplied", () => {
			expect(screen.getAllByRole("row")).toHaveLength(11); // 11 = 10 rows of data and 1 for the heading row
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
					screen.getByRole("cell", { name: /6 October 2021/i })
				).toBeInTheDocument();
			});
			it("should render the datetime attribute in ISO standard", () => {
				const time = screen
					.getByRole("cell", { name: /6 October 2021/i })
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("datetime", "2021-10-06T12:00:00");
			});
			it("should render a short version of the date as a data attribute for display on small screens with CSS", () => {
				const time = screen
					.getByRole("cell", { name: /6 October 2021/i })
					// eslint-disable-next-line testing-library/no-node-access
					.querySelector("time");
				expect(time).toHaveAttribute("data-shortdate", "6/10/2021");
			});
		});
	});
});
