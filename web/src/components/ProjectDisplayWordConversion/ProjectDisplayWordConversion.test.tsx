import { render, screen, within } from "@testing-library/react";

import mockConvertedDocumentFeed from "./../../__mocks__/__data__/inDev/guidance/gid-dg10086/documents/final-scope-html-conversion/html.json";
import {
	ProjectDisplayWordConversion,
	type ProjectDisplayWordConversionProps,
} from "./ProjectDisplayWordConversion";

const props: ProjectDisplayWordConversionProps = {
	content: mockConvertedDocumentFeed.content,
	sections: mockConvertedDocumentFeed.sections,
	inPageNavLinks: [],
	pdfLink: "/guidance/GID-DG10086/documents/final-scope-pdf",
	currentChapter: "",
	currentUrl:
		"/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion",
};

describe("ProjectDisplayWordConversion", () => {
	it("should match snapshot for all nav items", () => {
		const { container } = render(<ProjectDisplayWordConversion {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("should render the sections nav with two chapter menu items", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getAllByRole } = within(chapterNavList);
		const chapterNavListItems = getAllByRole("listitem");
		expect(chapterNavList).toBeInTheDocument();
		expect(chapterNavListItems.length).toEqual(props.sections.length);
	});

	it("should render the first chapter menu item as active with index as slug", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getAllByRole } = within(chapterNavList);
		const chapterNavListItems = getAllByRole("listitem");
		const { getByRole } = within(chapterNavListItems[0]);
		const firstNavListItemLink = getByRole("link", { current: true });
		expect(firstNavListItemLink).toBeInTheDocument();
	});

	it("should render the correct chapter menu item as active with chapter name as slug", () => {
		const dupedProps = { ...props };
		dupedProps.currentChapter = "recommendations";
		dupedProps.currentUrl =
			"/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion/chapter/recommendations";
		render(<ProjectDisplayWordConversion {...dupedProps} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getByRole } = within(chapterNavList);
		const recommendationsNavListItem = getByRole("link", {
			name: "Recommendations",
			current: true,
		});
		expect(recommendationsNavListItem).toBeInTheDocument();
	});

	it("should render the html content properly", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const htmlContentHeading = screen.getByText("Overview", { selector: "h2" });
		const htmlContentParagraph = screen.getByText(
			/^(This guideline covers care)/i,
			{ selector: "p" }
		);
		expect(htmlContentHeading).toBeInTheDocument();
		expect(htmlContentParagraph).toBeInTheDocument();
	});

	it("should have prev and next links", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		expect(prevAndNextLinksNav).toBeInTheDocument();
	});

	it("should have only next link when in first chapter", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		const { getAllByRole } = within(prevAndNextLinksNav);
		const prevAndNextLinks = getAllByRole("link");
		expect(prevAndNextLinks.length).toEqual(1);
		expect(prevAndNextLinks[0].textContent).toContain("Next page");
	});

	it("should have only previous link when in last chapter", () => {
		const dupedProps = { ...props };
		dupedProps.currentChapter = "recommendations";
		dupedProps.currentUrl =
			"/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion/chapter/recommendations";
		render(<ProjectDisplayWordConversion {...dupedProps} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		const { getAllByRole } = within(prevAndNextLinksNav);
		const prevAndNextLinks = getAllByRole("link");
		expect(prevAndNextLinks.length).toEqual(1);
		expect(prevAndNextLinks[0].textContent).toContain("Previous page");
	});

	it("should render pdf download button for converted document", () => {
		render(<ProjectDisplayWordConversion {...props} />);
		const downloadPDFButton = screen.getByRole("link", {
			name: "Download (PDF)",
		});
		expect(downloadPDFButton).toBeInTheDocument();
	});
});
