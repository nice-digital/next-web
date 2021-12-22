import { render, screen } from "@testing-library/react";

import { SearchSections } from "@/components/SearchSections/SearchSections";

// const defaultProps = {
// 	formattedTitle: <span>Test title (NG45)</span>,
// 	guidanceRef: "TEST101",
// 	headinglink: "http://beta.nice.org.uk",
// 	isPathway: false,
// 	summary: "a test summary",
// } as SearchCardListProps;

describe("SearchSections", () => {
	it.skip("should render search result title", () => {
		// render(<SearchCardList {...defaultProps} />);
		expect(screen.getByText("Test title (NG45)")).toBeInTheDocument();
	});

	it.skip("should render an svg icon if it is a pathway ", () => {
		// render(<SearchCardList {...defaultProps} />);
		console.log(screen.debug);
	});

	it.todo("should render search result title as link to search result item");

	it.todo("should render search result metadata");

	it.todo("should render programme metadata");

	it.todo(
		"should render last updated date metadata as time tag with correct formatted date"
	);
});
