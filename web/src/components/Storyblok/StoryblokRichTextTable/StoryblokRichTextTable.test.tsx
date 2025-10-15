import { render, screen } from "@testing-library/react";
import React from "react";

import { StoryblokRichTextTable } from "./StoryblokRichTextTable";
import mockBlok from '../../../__mocks__/__data__/storyblok/richTextTableData.json';


describe("StoryblokTable", () => {
	const renderTable = (overrides = {}) => {
		return render(
			<StoryblokRichTextTable blok={{ ...mockBlok, ...overrides }} />
		);
	};

	it("renders the table with headers and rows", () => {
		renderTable();
		expect(screen.getByTestId("storyblok-table")).toBeInTheDocument();
		expect(screen.getByTestId("table-head")).toBeInTheDocument();
		expect(screen.getByTestId("table-heading")).tag;
		expect(screen.getByTestId("table-body")).toBeInTheDocument();

		expect(screen.getByText("Coulmn1")).toBeInTheDocument();
		expect(screen.getByText("Column 2")).toBeInTheDocument();
		expect(screen.getByText("Row 1")).toBeInTheDocument();
		expect(screen.getByText(/Row 2 with a link to/i)).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Row 2 with a link to/i })
		).toBeInTheDocument();
	});

	it("renders the correct heading level", () => {
		renderTable({ heading: "Heading Level Test", headingLevel: 2 });
		const heading = screen.getByTestId("table-heading");
		expect(heading.tagName).toBe("H2");
		expect(heading).toHaveTextContent("Heading Level Test");
	});

	it("renders nothing when no table data is provided", () => {
		const emptyTableContent = {
			type: "doc",
			content: [{ type: "table", content: [] }],
		};
		const { container } = renderTable({ tableContent: emptyTableContent });

		// eslint-disable-next-line testing-library/no-node-access
		expect(container.firstChild).toBeNull();
	});

	it("renders without summary", () => {
		renderTable({ summary: undefined });
		expect(screen.queryByTestId("table-summary")).not.toBeInTheDocument();
	});
	it("renders the tagname of data inside cell correctly", () => {
		renderTable();
		const headerCell = screen.getByText("Column 2");
		const dataCell = screen.getByText("Row 1");
		expect(headerCell.tagName).toBe("B");
		expect(dataCell.tagName).toBe("P");
	});
	it("renders the alignment of data inside cell correctly", () => {
		renderTable();
		//eslint-disable-next-line testing-library/no-node-access
		const headerCell = screen.getByText("Column 2").closest("th");
		//eslint-disable-next-line testing-library/no-node-access
		const dataCell = screen.getByText("Row 2 with a link to").closest("td");
		expect(headerCell).toHaveAttribute("data-align", "right");
		expect(dataCell).toHaveAttribute("data-align", "right");
	});
});
