import { render, screen } from "@testing-library/react";

import { Document, search } from "@nice-digital/search-client";

import { SearchCardList } from "@/components/SearchCard/SearchCardList";

import searchResultDocuments from "../../__mocks__/__data__/search/search-result-documents.json";

const mockDocuments = [
	searchResultDocuments.guidanceNonMatchingDates as unknown as Document,
	searchResultDocuments.guidance as unknown as Document,
	searchResultDocuments.uncategorised as unknown as Document,
	searchResultDocuments.qualityStandard as unknown as Document,
] as unknown as Document[];

const mockDocumentSubSectionLinksBroken = [
	searchResultDocuments.qualityStandardWithoutSubsections as unknown as Document,
] as unknown as Document[];

const mockDocumentUnpublished = [
	searchResultDocuments.unpublished as unknown as Document,
] as unknown as Document[];

const mockDocumentMatchingDates = [
	searchResultDocuments.guidanceMatchingDates as unknown as Document,
];

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

	it("should render metadata", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByRole("definition").length).toBe(6);
		expect(screen.getAllByText("Test Resource Type").length).toBe(3);
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

	it("should throw error if subsection links don't parse", () => {
		expect(() =>
			render(<SearchCardList documents={mockDocumentSubSectionLinksBroken} />)
		).toThrow("Unhandled error. (Error: Non-whitespace before first tag.");
	});

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
