import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";

import {
	ConvertedDocumentChapterMenu,
	type ConvertedDocumentChapterMenuProps,
} from "./ConvertedDocumentChapterMenu";

describe("ConvertedDocumentChapterMenu", () => {
	const props: ConvertedDocumentChapterMenuProps = {
		ariaLabel: "Chapters",
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
		],
	};

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: "/somewhere#somewhere",
		});
	});

	it("should render labelled navigation wrapper", () => {
		render(<ConvertedDocumentChapterMenu {...props} />);
		expect(
			screen.getByRole("navigation", { name: "Chapters" })
		).toBeInTheDocument();
	});

	it("should render one linked menu item when there is only one chapter", () => {
		const propsOneChapter = { ...props };
		propsOneChapter.chapters = [propsOneChapter.chapters[0]];

		render(<ConvertedDocumentChapterMenu {...propsOneChapter} />);
		const menuNav = screen.getByRole("navigation", { name: "Chapters" });
		expect(menuNav).toBeInTheDocument();
		expect(within(menuNav).getAllByRole("link")).toHaveLength(1);
	});

	it("should render two linked menu items when there are two chapters", () => {
		render(<ConvertedDocumentChapterMenu {...props} />);
		const menuNav = screen.getByRole("navigation", { name: "Chapters" });
		expect(menuNav).toBeInTheDocument();
		expect(within(menuNav).getAllByRole("link")).toHaveLength(2);
	});
});
