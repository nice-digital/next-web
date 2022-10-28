import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { PublicationsPrevNext } from "./PublicationsPrevNext";

const useRouterMock = useRouter as jest.Mock;

const slug =
	"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

const firstChapterPath = `/indicators/${slug}`,
	secondChapterPath = `/indicators/${slug}/chapters/indicator-nm181`,
	thirdAndLastChapterPath = `/indicators/${slug}/chapters/further-information`;

const mockChapters = [
	{
		title: "First chapter",
		url: firstChapterPath,
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

describe("PublicationsPrevNext", () => {
	it("should render the next chapter page pagination link", () => {
		useRouterMock.mockReturnValue({
			asPath: secondChapterPath,
		});

		render(<PublicationsPrevNext chapters={mockChapters} />);

		expect(
			screen.getByRole("link", {
				name: "Next page Third and last chapter",
			})
		).toHaveAttribute("href", thirdAndLastChapterPath);
	});

	it("should render the previous chapter page pagination link", () => {
		useRouterMock.mockReturnValue({
			asPath: secondChapterPath,
		});

		render(<PublicationsPrevNext chapters={mockChapters} />);

		expect(
			screen.getByRole("link", {
				name: "Previous page First chapter",
			})
		).toHaveAttribute("href", firstChapterPath);
	});

	it("should not render a next page link on last chapter", () => {
		useRouterMock.mockReturnValue({
			asPath: thirdAndLastChapterPath,
		});
		render(<PublicationsPrevNext chapters={mockChapters} />);
		expect(screen.queryByText("Next page")).not.toBeInTheDocument();
	});

	it("should not render a previous page link on first chapter", () => {
		useRouterMock.mockReturnValue({
			asPath: firstChapterPath,
		});
		render(<PublicationsPrevNext chapters={mockChapters} />);
		expect(screen.queryByText("Previous page")).not.toBeInTheDocument();
	});
});
