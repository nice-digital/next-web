import { render, screen } from "@testing-library/react";

import { HTMLChapterSectionInfo } from "@/feeds/publications/types";

import { PublicationsChapterSectionsList } from "./PublicationsChapterSectionList";

const mockSections = [
	{ title: "test section title 1", chapterSlug: "test-section-title-1" },
	{ title: "test section title 2", chapterSlug: "test-section-title-2" },
] as unknown as HTMLChapterSectionInfo[];

describe("PublicationsChapterSectionList", () => {
	it("should render aria labelled wrapping nav element", () => {
		render(<PublicationsChapterSectionsList sections={mockSections} />);
		expect(screen.getByRole("navigation")).toHaveAccessibleName("On this page");
	});
	it("should render aria labelled list", () => {
		render(<PublicationsChapterSectionsList sections={mockSections} />);
		expect(screen.getByRole("list")).toHaveAccessibleName(
			"Jump to sections on this page"
		);
	});
	it("should have an 'On this page' level 2 heading", () => {
		render(<PublicationsChapterSectionsList sections={mockSections} />);
		expect(
			screen.getByRole("heading", { level: 2, name: "On this page" })
		).toBeInTheDocument();
	});
	it("should display a list of links to in page anchors", () => {
		render(<PublicationsChapterSectionsList sections={mockSections} />);
		const anchorLinks = screen.getAllByRole("link");
		expect(anchorLinks[0]).toHaveAttribute("href", "#test-section-title-1");
		expect(anchorLinks[1]).toHaveAttribute("href", "#test-section-title-2");
	});

	it("should not render when array contains a sinlge section", () => {
		render(
			<PublicationsChapterSectionsList
				sections={
					[
						{
							title: "test section title 1",
							chapterSlug: "test-section-title-1",
						},
					] as unknown as HTMLChapterSectionInfo[]
				}
			/>
		);
		expect(
			screen.queryByRole("heading", { level: 2, name: "On this page" })
		).not.toBeInTheDocument();

		expect(
			screen.queryByRole("list", {
				name: "Jump to sections on this page",
			})
		).not.toBeInTheDocument();
	});
});
