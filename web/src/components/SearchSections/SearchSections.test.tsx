import { screen } from "@testing-library/react";

import { SubSection } from "@/components/SearchCard/SearchCardList";
import { SearchSections } from "@/components/SearchSections/SearchSections";
import { render } from "@/test-utils";

const mockParsedLinks: SubSection[] = [
	{ $: { url: "/testsubsection/1" }, _: "Test subsection 1" },
	{ $: { url: "/testsubsection/2" }, _: "Test subsection 2" },
];

const mockParsedLinksRec: SubSection[] = [
	{ $: { url: "/testsubsection/1" }, _: "Test subsection 1" },
	{ $: { url: "/testsubsection/2" }, _: "Test subsection 2" },
	{ $: { url: "/chapter/recommendations" }, _: "Recommedations subsection" },
	{
		$: { url: "/chapter/test-recommendations" },
		_: "Recommedations subsection 2",
	},
	{
		$: { url: "/chapter/test-guidance" },
		_: "Recommedations subsection 3",
	},
];

const mockParsedLinksQual: SubSection[] = [
	{ $: { url: "/testsubsection/1" }, _: "Test subsection 1" },
	{ $: { url: "/testsubsection/2" }, _: "Test subsection 2" },
	{
		$: { url: "/chapter/list-of-quality-statements" },
		_: "Quality subsection",
	},
	{
		$: { url: "/chapter/list-of-statements" },
		_: "Quality subsection 2",
	},
	{
		$: { url: "/chapter/quality-statements" },
		_: "Quality subsection 3",
	},
];

const defaultProps = {
	guidanceRef: "TestRef999",
};

beforeEach(() => {
	// render(<SearchSections parsedLinks={mockParsedLinks} {...defaultProps} />);
});

describe("SearchSections", () => {
	it("should render a progressive disclosure element with the text 'show all sections'", () => {
		render(
			<SearchSections parsedLinks={mockParsedLinksRec} {...defaultProps} />
		);
		expect(screen.getByText(/show all sections/i)).toBeInTheDocument();
	});
	it("should render links to the supplied subsections", () => {
		render(
			<SearchSections parsedLinks={mockParsedLinksRec} {...defaultProps} />
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
			<SearchSections parsedLinks={mockParsedLinksRec} {...defaultProps} />
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
			<SearchSections parsedLinks={mockParsedLinksRec} {...defaultProps} />
		);
		expect(screen.getAllByRole("link").length).toBe(6);
	});

	it("should render correct number of quality standards key links", () => {
		render(
			<SearchSections parsedLinks={mockParsedLinksQual} {...defaultProps} />
		);
		expect(screen.getAllByRole("link").length).toBe(6);
	});

	it("should render a 'View Recommendations' keyLink", () => {
		render(
			<SearchSections parsedLinks={mockParsedLinksRec} {...defaultProps} />
		);
		expect(
			screen.getByRole("link", {
				name: /view recommendations for TestRef999/i,
			})
		).toBeInTheDocument();
	});

	it("should render a 'View quality statements' keyLink with the correct href", () => {
		render(
			<SearchSections parsedLinks={mockParsedLinksQual} {...defaultProps} />
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
		render(<SearchSections parsedLinks={mockParsedLinks} {...defaultProps} />);

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
				parsedLinks={mockParsedLinksQual}
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
