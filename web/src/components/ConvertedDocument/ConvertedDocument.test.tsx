import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";

import mockConvertedDocumentFeed from "./../../__mocks__/__data__/inDev/guidance/gid-dg10086/documents/final-scope-html-conversion/html.json";
import {
	ConvertedDocument,
	type ConvertedDocumentProps,
} from "./ConvertedDocument";

const props: ConvertedDocumentProps = {
	lastUpdated: "2021-04-01T12:00:0",
	resource: {
		chapters: mockConvertedDocumentFeed.chapters,
		htmlBody: mockConvertedDocumentFeed.content,
		isConvertedDocument: false,
		pdfDownloadLink: "/guidance/GID-DG10086/documents/final-scope-pdf",
		sections: [], // mockConvertedDocumentFeed.sections
		title: "Test converted document",
	}
};

const useRouterMock = jest.mocked(useRouter);

describe("ConvertedDocument", () => {
	beforeEach(() => {
		useRouterMock.mockReturnValue({
			asPath: "/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion",
		} as ReturnType<typeof useRouter>);
	});

	it("should match snapshot for all nav items", () => {
		const { container } = render(<ConvertedDocument {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("should render the sections nav with two chapter menu items", () => {
		render(<ConvertedDocument {...props} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getAllByRole } = within(chapterNavList);
		const chapterNavListItems = getAllByRole("listitem");
		expect(chapterNavList).toBeInTheDocument();
		expect(chapterNavListItems.length).toEqual(props.resource.chapters.length);
	});

	it("should render the first chapter menu item as active with index as slug", () => {
		render(<ConvertedDocument {...props} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getAllByRole } = within(chapterNavList);
		const chapterNavListItems = getAllByRole("listitem");
		const { getByRole } = within(chapterNavListItems[0]);
		const firstNavListItemLink = getByRole("link", { current: true });
		expect(firstNavListItemLink).toBeInTheDocument();
	});

	it("should render the correct chapter menu item as active with chapter name as slug", () => {
		useRouterMock.mockReturnValue({
			asPath: "/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion/chapter/recommendations",
		} as ReturnType<typeof useRouter>);

		render(<ConvertedDocument {...props} />);
		const chapterNavList = screen.getByRole("navigation", { name: "chapters" });
		const { getByRole } = within(chapterNavList);
		const recommendationsNavListItem = getByRole("link", {
			name: "Recommendations",
			current: true,
		});
		expect(recommendationsNavListItem).toBeInTheDocument();
	});

	it("should render the html content properly", () => {
		render(<ConvertedDocument {...props} />);
		const htmlContentHeading = screen.getByText("Overview", { selector: "h2" });
		const htmlContentParagraph = screen.getByText(
			/^(This guideline covers care)/i,
			{ selector: "p" }
		);
		expect(htmlContentHeading).toBeInTheDocument();
		expect(htmlContentParagraph).toBeInTheDocument();
	});

	it("should have prev and next links", () => {
		render(<ConvertedDocument {...props} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		expect(prevAndNextLinksNav).toBeInTheDocument();
	});

	it("should have only next link when in first chapter", () => {
		render(<ConvertedDocument {...props} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		const { getAllByRole } = within(prevAndNextLinksNav);
		const prevAndNextLinks = getAllByRole("link");
		expect(prevAndNextLinks.length).toEqual(1);
		expect(prevAndNextLinks[0].textContent).toContain("Next page");
	});

	it("should have only previous link when in last chapter", () => {
		useRouterMock.mockReturnValue({
			asPath: "/guidance/topic-selection/gid-dg10086/documents/final-scope-html-conversion/chapter/recommendations",
		} as ReturnType<typeof useRouter>);

		render(<ConvertedDocument {...props} />);
		const prevAndNextLinksNav = screen.getByRole("navigation", {
			name: "Previous and next pages",
		});
		const { getAllByRole } = within(prevAndNextLinksNav);
		const prevAndNextLinks = getAllByRole("link");
		expect(prevAndNextLinks.length).toEqual(1);
		expect(prevAndNextLinks[0].textContent).toContain("Previous page");
	});

	it("should render pdf download button for converted document", () => {
		render(<ConvertedDocument {...props} />);
		const downloadPDFButton = screen.getByRole("link", {
			name: "Download PDF",
		});
		expect(downloadPDFButton).toBeInTheDocument();
	});
});
