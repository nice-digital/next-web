import { render, screen } from "@testing-library/react";

import { Document } from "@nice-digital/search-client";

import { SearchCardList } from "@/components/SearchCard/SearchCardList";

import {
	guidanceDoc,
	guidanceDocNonMatchingDates,
	qualityStandardDoc,
	uncategorisedDoc,
	guidanceDocMatchingDates,
	unpublishedDoc,
} from "../../__mocks__/__data__/search/documents/";

const mockDocuments = [
	guidanceDoc,
	guidanceDocNonMatchingDates,
	qualityStandardDoc,
	uncategorisedDoc,
] as unknown as Document[];

describe("SearchCard", () => {
	it("should render search result title", () => {
		render(<SearchCardList documents={[guidanceDoc]} />);

		const resultTitle = screen.getByText((content, element) => {
			const theText =
				element?.innerHTML ===
				"Rheumatoid arthritis in adults: management (<b>NG100</b>)";

			return theText;
		});

		expect(resultTitle).toBeInTheDocument();
	});

	it("should render search result title as link to search result item", () => {
		render(<SearchCardList documents={[guidanceDoc]} />);
		expect(
			screen.getByRole("link", {
				name: "Rheumatoid arthritis in adults: management ( NG100 )",
			})
		).toHaveAttribute("href", "/guidance/ng100");
	});

	it("should render metadata", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByRole("definition").length).toBe(6);
		expect(screen.getAllByText("Test Resource Type").length).toBe(3);
	});

	it("should NOT render metadata for uncategorised results", () => {
		render(<SearchCardList documents={[uncategorisedDoc]} />);
		expect(screen.queryByText(/1 January 1970/i)).not.toBeInTheDocument();
	});

	it("should render last updated date metadata in the correct date format", () => {
		render(<SearchCardList documents={[guidanceDocNonMatchingDates]} />);
		expect(screen.getAllByText("Last updated").length).toBe(1);
		expect(screen.getByText("24 November 2021")).toBeInTheDocument();
	});

	it("should render published date in the correct date format", () => {
		render(<SearchCardList documents={[guidanceDoc]} />);
		expect(screen.getAllByText("Published").length).toBe(1);
		expect(screen.getByText("6 April 2021")).toBeInTheDocument();
	});

	it.todo(
		"test for no results returned, currently erroring when a no results returned"
	);

	it("should render the published date in the correct date format if it matches the last updated date", () => {
		render(<SearchCardList documents={[guidanceDocMatchingDates]} />);
		expect(screen.queryByText("Last updated")).not.toBeInTheDocument();
		expect(screen.getByText("Published")).toBeInTheDocument();
		expect(screen.getByText("1 January 2021")).toBeInTheDocument();
	});

	it("should render meta data without published/last updated dates for an unpublished document", () => {
		render(<SearchCardList documents={[unpublishedDoc]} />);
		expect(screen.queryByText("Last updated")).not.toBeInTheDocument();
		expect(screen.queryByText("Published")).not.toBeInTheDocument();
		expect(screen.getByText("NICE guideline")).toBeInTheDocument();
	});
});
