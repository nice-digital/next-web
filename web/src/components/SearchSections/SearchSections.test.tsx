import { screen } from "@testing-library/react";

import { Document } from "@nice-digital/search-client";

import { SearchSections } from "@/components/SearchSections/SearchSections";
import { render } from "@/test-utils";

const mockParsedLinks: Document["subSections"] = [
	{ title: "Test subsection 1", url: "/testsubsection/1" },
	{ title: "Test subsection 2", url: "/testsubsection/2" },
];

const mockParsedLinksRec: Document["subSections"] = [
	{ title: "Test subsection 1", url: "/testsubsection/1" },
	{ title: "Test subsection 2", url: "/testsubsection/2" },
	{ title: "Recommedations subsection", url: "/chapter/recommendations" },
	{
		title: "Recommedations subsection 2",
		url: "/chapter/test-recommendations",
	},
	{
		title: "Recommedations subsection 3",
		url: "/chapter/test-guidance",
	},
];

const mockParsedLinksQual: Document["subSections"] = [
	{ title: "Test subsection 1", url: "/testsubsection/1" },
	{ title: "Test subsection 2", url: "/testsubsection/2" },
	{
		title: "Quality subsection",
		url: "/chapter/list-of-quality-statements",
	},
	{
		title: "Quality subsection 2",
		url: "/chapter/list-of-statements",
	},
	{
		title: "Quality subsection 3",
		url: "/chapter/quality-statements",
	},
];

const defaultProps = {
	guidanceRef: "TestRef999",
};

describe("SearchSections", () => {
	it("should render a progressive disclosure element with the text 'show all sections'", () => {
		render(
			<SearchSections subSections={mockParsedLinksRec} {...defaultProps} />
		);
		expect(screen.getByText(/show all sections/i)).toBeInTheDocument();
	});
	it("should render links to the supplied subsections", () => {
		render(
			<SearchSections subSections={mockParsedLinksRec} {...defaultProps} />
		);
		expect(
			screen.getByRole("link", { name: /test subsection 1/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /test subsection 2/i })
		).toBeInTheDocument();
	});

	it("should render section links with the correct href and link text", () => {
		render(
			<SearchSections subSections={mockParsedLinksRec} {...defaultProps} />
		);
		expect(
			screen.getByRole("link", { name: "Recommedations subsection" })
		).toHaveAttribute("href", "/chapter/recommendations");
		expect(
			screen.getByRole("link", { name: "Test subsection 1" })
		).toHaveAttribute("href", "/testsubsection/1");
	});

	it("should render correct number of recommendations key links", () => {
		render(
			<SearchSections subSections={mockParsedLinksRec} {...defaultProps} />
		);
		expect(screen.getAllByRole("link").length).toBe(6);
	});

	it("should render correct number of quality standards key links", () => {
		render(
			<SearchSections subSections={mockParsedLinksQual} {...defaultProps} />
		);
		expect(screen.getAllByRole("link").length).toBe(6);
	});

	it("should render a 'View Recommendations' keyLink", () => {
		render(
			<SearchSections subSections={mockParsedLinksRec} {...defaultProps} />
		);
		expect(
			screen.getByRole("link", {
				name: /view recommendations for TestRef999/i,
			})
		).toBeInTheDocument();
	});

	it("should render a 'View quality statements' keyLink with the correct href", () => {
		render(
			<SearchSections subSections={mockParsedLinksQual} {...defaultProps} />
		);
		expect(
			screen.getByRole("link", {
				name: /view quality statements for TestRef999/i,
			})
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", {
				name: /view quality statements for TestRef999/i,
			})
		).toHaveAttribute("href", "/chapter/list-of-quality-statements");
	});

	it("should NOT render a key link when there is no match for recommendations or quality standards", () => {
		render(<SearchSections subSections={mockParsedLinks} {...defaultProps} />);

		expect(
			screen.queryByRole("link", {
				name: /view quality statements for TestRef999/i,
			})
		).not.toBeInTheDocument();

		expect(
			screen.queryByRole("link", {
				name: /view recommendations for TestRef999/i,
			})
		).not.toBeInTheDocument();
	});

	it("should render a heading including the guidanceRef", () => {
		render(
			<SearchSections
				subSections={mockParsedLinksQual}
				guidanceRef="TestRef1001"
			/>
		);
		expect(
			screen.getByRole("heading", {
				level: 4,
				name: "Sections for TestRef1001",
			})
		).toBeInTheDocument();
	});
});
