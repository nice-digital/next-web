import { render, screen } from "@testing-library/react";

import {
	SearchCard,
	SearchCardProps,
} from "@/components/SearchCard/SearchCard";

const defaultProps = {
	formattedTitle: <span>Test title</span>,
	guidanceRef: "TEST101",
	headinglink: "string",
	isPathway: false,
	summary: "a test summary",
} as SearchCardProps;

describe("SearchCard", () => {
	it.only("should render title", () => {
		render(<SearchCard {...defaultProps} />);
	});

	it.todo("should render data element with ID value around product title");

	it.todo("should render search result title as link to search result item");

	it.todo("should render search result metadata");

	it.todo("should render programme metadata");

	it.todo(
		"should render last updated date metadata as time tag with correct formatted date"
	);
});
