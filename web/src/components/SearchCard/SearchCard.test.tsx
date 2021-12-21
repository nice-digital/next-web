import { render, screen } from "@testing-library/react";

import {
	SearchCard,
	SearchCardProps,
} from "@/components/SearchCard/SearchCard";

const defaultProps = {
	formattedTitle: <span>Test title (NG45)</span>,
	guidanceRef: "TEST101",
	headinglink: "http://beta.nice.org.uk",
	isPathway: false,
	summary: "a test summary",
} as SearchCardProps;

describe("SearchCard", () => {
	it("should render search result title", () => {
		render(<SearchCard {...defaultProps} />);
		expect(screen.getByText("Test title (NG45)")).toBeInTheDocument();
	});

	it.only("should render an svg icon if it is a pathway ", () => {
		render(<SearchCard {...defaultProps} />);
		console.log(screen.debug);
	});

	it.todo("should render search result title as link to search result item");

	it.todo("should render search result metadata");

	it.todo("should render programme metadata");

	it.todo(
		"should render last updated date metadata as time tag with correct formatted date"
	);
});
