import { render, screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import {
	PublicationsPrevNext,
	type PublicationsPrevNextProps,
} from "./PublicationsPrevNext";

const indicatorSlug = "ind123-some-title",
	firstOverviewChapterPath = `/indicators/${indicatorSlug}`,
	secondChapterPath = `/indicators/${indicatorSlug}/chapter/indicator-nm181`,
	thirdAndLastChapterPath = `/indicators/${indicatorSlug}/chapter/further-information`,
	mockChapters: PublicationsPrevNextProps["chapters"] = [
		{
			title: "First chapter",
			url: firstOverviewChapterPath,
		},
		{
			title: "Second chapter",
			url: secondChapterPath,
		},
		{
			title: "Third and last chapter",
			url: thirdAndLastChapterPath,
		},
	];

const mockRouterPath = (asPath: string) => {
	jest.mocked(useRouter).mockReturnValue({
		asPath,
	} as NextRouter);
};

describe("PublicationsPrevNext", () => {
	it("should render the next chapter page pagination link", () => {
		mockRouterPath(secondChapterPath);

		render(<PublicationsPrevNext chapters={mockChapters} />);

		expect(
			screen.getByRole("link", {
				name: "Next page Third and last chapter",
			})
		).toHaveAttribute("href", thirdAndLastChapterPath);
	});

	it("should render the previous chapter page pagination link", () => {
		mockRouterPath(secondChapterPath);

		render(<PublicationsPrevNext chapters={mockChapters} />);

		expect(
			screen.getByRole("link", {
				name: "Previous page First chapter",
			})
		).toHaveAttribute("href", firstOverviewChapterPath);
	});

	it("should not render a next page link on last chapter", () => {
		mockRouterPath(thirdAndLastChapterPath);
		render(<PublicationsPrevNext chapters={mockChapters} />);
		expect(screen.queryByText("Next page")).not.toBeInTheDocument();
	});

	it("should not render a previous page link on first chapter", () => {
		mockRouterPath(firstOverviewChapterPath);
		render(<PublicationsPrevNext chapters={mockChapters} />);
		expect(screen.queryByText("Previous page")).not.toBeInTheDocument();
	});
});
