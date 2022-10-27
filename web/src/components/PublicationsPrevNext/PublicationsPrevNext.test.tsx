import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { PublicationsPrevNext } from "./PublicationsPrevNext";

const slug =
	"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

const chapterSlug = "indicator-nm181";

const mockChapters = [
	{
		title: "Overview",
		url: `/indicators/${slug}`,
	},
	{
		title: "Indicator NM181",
		url: `/indicators/${slug}/chapters/indicator-nm181`,
	},
	{
		title: "Further information",
		url: `/indicators/${slug}/chapters/further-information`,
	},
];

describe("PublicationsPrevNext", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: `/indicators/${slug}/chapters/${chapterSlug}`,
		}));
		jest.resetModules();
	});

	describe("pagination", () => {
		it("should render the next chapter page pagination link", () => {
			render(<PublicationsPrevNext chapters={mockChapters} />);

			const nextPageLink = screen.getByText("Next page");

			expect(nextPageLink).toBeInTheDocument();

			// eslint-disable-next-line testing-library/no-node-access
			expect(nextPageLink.parentElement).toHaveAttribute(
				"href",
				`/indicators/${slug}/chapters/further-information`
			);

			// eslint-disable-next-line testing-library/no-node-access
			expect(nextPageLink.parentElement).toHaveAccessibleName(
				"Next page Further information"
			);
		});

		it("should render the previous chapter page pagination link", () => {
			render(<PublicationsPrevNext chapters={mockChapters} />);

			const previousPageLink = screen.getByText("Previous page");

			expect(previousPageLink).toBeInTheDocument();

			// eslint-disable-next-line testing-library/no-node-access
			expect(previousPageLink.parentElement).toHaveAttribute(
				"href",
				`/indicators/${slug}`
			);
			// eslint-disable-next-line testing-library/no-node-access
			expect(previousPageLink.parentElement).toHaveAccessibleName(
				"Previous page Overview"
			);
		});

		it("should not render a next page link on last chapter", () => {
			(useRouter as jest.Mock).mockImplementation(() => ({
				asPath: `/indicators/${slug}/chapters/further-information`,
			}));
			render(<PublicationsPrevNext chapters={mockChapters} />);
			expect(screen.queryByText("Next page")).not.toBeInTheDocument();
		});

		it("should not render a previous page link on first chapter", () => {
			(useRouter as jest.Mock).mockImplementation(() => ({
				asPath: `/indicators/${slug}/chapters/overview`,
			}));
			render(<PublicationsPrevNext chapters={mockChapters} />);
			expect(screen.queryByText("Previous page")).not.toBeInTheDocument();
		});
	});
});
