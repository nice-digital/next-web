import { render, screen } from "@testing-library/react";

import { SearchCardList } from "@/components/SearchCard/SearchCardList";

import { mockDocuments, mockUncategorisedDocuments } from "./mockDocuments";

describe("SearchCard", () => {
	it("should render search result title", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getByText("Test title")).toBeInTheDocument();
	});

	it("should render search result title as link to search result item", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getByRole("link", { name: "Test title" })).toHaveAttribute(
			"href",
			"/pathways/test"
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
		expect(screen.getAllByRole("definition").length).toBe(11);
		expect(screen.getAllByText("NICE Pathway").length).toBe(2);
	});

	it.skip("should NOT render metadata for uncategorised results", () => {
		render(<SearchCardList documents={mockUncategorisedDocuments} />);
	});

	it("should render last updated date metadata in the correct date format", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByText(/last updated/i).length).toBe(2);
		expect(screen.getByText("24 November 2021")).toBeInTheDocument();
	});

	it("should render published date", () => {
		render(<SearchCardList documents={mockDocuments} />);
		expect(screen.getAllByText(/published/i).length).toBe(3);
		expect(screen.getByText(/6 April 2021/i)).toBeInTheDocument();
	});

	it.todo(
		"should render the published date if it matches the last updated date"
	);
});
