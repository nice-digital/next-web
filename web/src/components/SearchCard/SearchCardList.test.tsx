import { render, screen } from "@testing-library/react";

import { SearchCardList } from "@/components/SearchCard/SearchCardList";

import {
	mockDocuments,
	mockDocumentMatchingDates,
	mockDocumentUnpublished,
} from "./mockDocuments";

describe("SearchCard", () => {
	it("should render search result title", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getByText("Test title")).toBeInTheDocument();
	});

	it("should render search result title as link to search result item", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getByRole("link", { name: "Test title" })).toHaveAttribute(
			"href",
			"/guidance/test"
		);
	});

	it("should render an svg icon for a NICE Pathway result", () => {
		render(<SearchCardList documents={mockDocuments} />);
		const pathwayLink = screen.getByRole("link", {
			name: "Test pathway",
		}).firstChild;

		// const pathwayLink = container.querySelector('#sandbox > div > ol > li:nth-child(2) > div > header > p > a > svg > path')
		expect(pathwayLink?.nodeName).toBe("svg");
	});

	it("should NOT render an svg icon for a non NICE Pathway result", () => {
		render(<SearchCardList documents={mockDocuments} />);
		const pathwayLink = screen.getByRole("link", {
			name: "Test quality standard",
		}).firstChild;
		expect(pathwayLink?.nodeName).not.toBe("svg");
	});

	it("should render metadata", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByRole("definition").length).toBe(6);
		expect(screen.getAllByText("Test Resource Type").length).toBe(2);
	});

	it("should NOT render metadata for uncategorised results", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.queryByText(/1 January 1970/i)).not.toBeInTheDocument();
	});

	it("should render last updated date metadata in the correct date format", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByText(/last updated/i).length).toBe(1);
		expect(screen.getByText(/24 November 2021/i)).toBeInTheDocument();
	});

	it("should render published date in the correct date format", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByText(/published/i).length).toBe(2);
		expect(screen.getByText(/6 April 2021/i)).toBeInTheDocument();
	});

	it.todo(
		"test for no results returned, currently erroring when a no results returned"
	);

	it("should render the published date in the correct date format if it matches the last updated date", () => {
		render(<SearchCardList documents={mockDocumentMatchingDates} />);
		expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
		expect(screen.getByText(/published/i)).toBeInTheDocument();
		expect(screen.getByText(/1 January 2021/i)).toBeInTheDocument();
	});

	it("should render meta data without published/last updated dates for an unpublished document", () => {
		render(<SearchCardList documents={mockDocumentUnpublished} />);
		expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/published/i)).not.toBeInTheDocument();
		expect(screen.getByText(/nice guideline/i)).toBeInTheDocument();
	});
});
