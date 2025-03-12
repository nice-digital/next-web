import React from "react";
import { render, screen } from "@testing-library/react";
import { StoryblokTable } from "./StoryblokTable";

const mockBlok = {
	_uid: "1",
	title: "Test Table",
	summary: "This is a test table",
	table: {
		thead: [
			{ _uid: "h1", value: "Header 1", component: "tableCol" },
			{ _uid: "h2", value: "Header 2", component: "tableCol" },
		],
		tbody: [
			{
				_uid: "r1",
				component: "tableRow",
				body: [
					{ _uid: "c1", value: "Row 1 Col 1", component: "tableCol" },
					{ _uid: "c2", value: "Row 1 Col 2", component: "tableCol" },
				],
			},
		],
	},
};

describe("StoryblokTable", () => {
	const renderTable = (overrides = {}) => {
		return render(<StoryblokTable blok={{ ...mockBlok, ...overrides }} />);
	};

	it("renders the table with headers and rows", () => {
		renderTable();
		expect(screen.getByTestId("storyblok-table")).toBeInTheDocument();
		expect(screen.getByTestId("table-head")).toBeInTheDocument();
		expect(screen.getByTestId("table-body")).toBeInTheDocument();

		expect(screen.getByTestId("table-header-h1")).toHaveTextContent("Header 1");
		expect(screen.getByTestId("table-header-h2")).toHaveTextContent("Header 2");

		expect(screen.getByTestId("table-row-r1")).toBeInTheDocument();
		expect(screen.getByTestId("table-cell-c1")).toHaveTextContent("Row 1 Col 1");
		expect(screen.getByTestId("table-cell-c2")).toHaveTextContent("Row 1 Col 2");
	});

	it("renders nothing when no table data is provided", () => {
		const { container } = renderTable({ table: { thead: [], tbody: [] } });
		expect(container.firstChild).toBeNull();
	});

	describe("Table caption", () => {
		it("renders caption with title and summary", () => {
			renderTable({ title: "Test Title", summary: "Test Summary" });
			expect(screen.getByTestId("table-caption")).toHaveTextContent("Test Title");
			expect(screen.getByTestId("table-summary")).toHaveTextContent("Test Summary");
		});

		it("renders table with aria-describedby attribute pointing to summary", () => {
			renderTable({ title: "Test Title", summary: "Test Summary" });
			expect(screen.getByTestId("storyblok-table")).toHaveAttribute("aria-describedby", "table-summary");
		});

		it("renders caption with only title when summary is missing", () => {
			renderTable({ title: "Only Title", summary: undefined });
			expect(screen.getByTestId("table-caption")).toHaveTextContent("Only Title");
		});

		it("renders caption with only summary when title is missing", () => {
			renderTable({ title: undefined, summary: "Only Summary" });
			expect(screen.getByTestId("table-caption")).not.toHaveTextContent("Only Title");
			expect(screen.getByTestId("table-summary")).toHaveTextContent("Only Summary");
		});

		it("does not render caption when both title and summary are missing", () => {
			renderTable({ title: undefined, summary: undefined });
			expect(screen.queryByTestId("table-caption")).not.toBeInTheDocument();
			expect(screen.queryByTestId("table-summary")).not.toBeInTheDocument();
		});
	});
});
