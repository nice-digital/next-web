import { render, screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import {
	ConvertedDocumentPrevNext,
	type ConvertedDocumentPrevNextProps,
} from "./ConvertedDocumentPrevNext";

const mockRouterPath = (asPath: string) => {
	jest.mocked(useRouter).mockReturnValue({
		asPath,
	} as NextRouter);
};

const indicatorSlug = "ind999-indicator-history-tab-html-conversion",
	firstOverviewChapterPath = `/indicators/${indicatorSlug}/html-conversion`,
	secondChapterPath = `/indicators/${indicatorSlug}/html-conversion/chapter/the-technologies`,
	thirdAndLastChapterPath = `/indicators/${indicatorSlug}/html-conversion/chapter/committee-discussion`;

const props: ConvertedDocumentPrevNextProps = {
	chapters: [
		{
			href: "/guidance/IND999/documents/html-conversion/chapter/recommendations",
			slug: "recommendations",
			title: "1 Recommendations",
		},
		{
			href: "/guidance/IND999/documents/html-conversion/chapter/the-technologies",
			slug: "the-technologies",
			title: "2 The technologies",
		},
		{
			href: "/guidance/IND999/documents/html-conversion/chapter/committee-discussion",
			slug: "committee-discussion",
			title: "3 Committee discussion",
		},
	],
};

describe("ConvertedDocumentPrevNext", () => {
	it("should render the next chapter page pagination link", () => {
		mockRouterPath(secondChapterPath);
		render(<ConvertedDocumentPrevNext {...props} />);
		expect(
			screen.getByRole("link", {
				name: "Next page 3 Committee discussion",
			})
		).toHaveAttribute("href", thirdAndLastChapterPath);
	});

	it("should render the previous chapter page pagination link", () => {
		mockRouterPath(secondChapterPath);
		render(<ConvertedDocumentPrevNext {...props} />);
		expect(
			screen.getByRole("link", {
				name: "Previous page 1 Recommendations",
			})
		).toHaveAttribute("href", firstOverviewChapterPath);
	});

	it("should not render a next page link on last chapter", () => {
		mockRouterPath(thirdAndLastChapterPath);
		render(<ConvertedDocumentPrevNext {...props} />);
		expect(screen.queryByText("Next page")).not.toBeInTheDocument();
	});

	it("should not render a previous page link on first chapter", () => {
		mockRouterPath(firstOverviewChapterPath);
		render(<ConvertedDocumentPrevNext {...props} />);
		expect(screen.queryByText("Previous page")).not.toBeInTheDocument();
	});
});
