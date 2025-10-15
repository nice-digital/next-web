import { render, screen } from "@testing-library/react";
import React from "react";

import { StoryblokRichTextTable } from "./StoryblokRichTextTable";

const mockBlok = {
	_uid: "1",
	heading: "Test Table",
	headingLevel: 3,
	summary: {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						text: "This is a summary of the table.",
						type: "text",
					},
				],
			},
		],
	},
	tableContent: {
		type: "doc",
		content: [
			{
				type: "table",
				content: [
					{
						type: "tableRow",
						content: [
							{
								type: "tableCell",

								content: [
									{
										type: "paragraph",

										content: [
											{
												text: "Coulmn1",
												type: "text",
												marks: [
													{
														type: "bold",
													},
												],
											},
										],
									},
								],
							},
							{
								type: "tableCell",

								content: [
									{
										type: "paragraph",
										attrs: {
											textAlign: "right",
										},
										content: [
											{
												text: "Column 2",
												type: "text",
												marks: [
													{
														type: "bold",
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						type: "tableRow",
						content: [
							{
								type: "tableCell",

								content: [
									{
										type: "paragraph",

										content: [
											{
												text: "Row 1",
												type: "text",
											},
										],
									},
								],
							},
							{
								type: "tableCell",

								content: [
									{
										type: "paragraph",
										attrs: {
											textAlign: "right",
										},
										content: [
											{
												text: "Row 2 with a link to ",
												type: "text",
												marks: [
													{
														type: "link",
														attrs: {
															href: "/getting-involved-as-someone-with-lived-experience",

															linktype: "story",
															story: {
																name: "Getting involved as someone with lived experience",
															},
														},
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
};

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
		const headerCell = screen.getByText("Column 2").closest("th");
		const dataCell = screen.getByText("Row 1").closest("td");
		expect(headerCell).toHaveAttribute("data-align", "right");
		expect(dataCell).toHaveAttribute("data-align", "left");
	});
});
