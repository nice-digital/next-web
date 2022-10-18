import { render, screen } from "@testing-library/react";

import { PublicationsChapterMenu } from "./PublicationsChapterMenu";

const defaultProps = {
	chapters: [
		{
			title: "Test Chapter 1",
			url: "/IND1001/chapter/Test-Chapter-1",
		},
		{
			title: "Test Chapter 2",
			url: "/IND1001/chapter/Test-Chapter-2",
		},
	],
	productType: "IND",
	slug: "test001-test-product-title",
};

describe("PublicationsChapterMenu", () => {
	it.each([
		[
			"Test Chapter 1",
			"/indicators/test001-test-product-title/chapters/test-chapter-1",
		],
		[
			"Test Chapter 2",
			"/indicators/test001-test-product-title/chapters/test-chapter-2",
		],
	])("should render chapter heading %s with link to %s", (linkText, href) => {
		render(<PublicationsChapterMenu {...defaultProps} />);
		const link = screen.getByText(linkText);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
	});

	it("should render links starting with correct product type path", () => {
		render(<PublicationsChapterMenu {...defaultProps} />);
		const link = screen.getByText("Test Chapter 2");
		const href = link.getAttribute("href");
		expect(href && href.startsWith("/indicators/", 0)).toBe(true);
	});

	it.todo("should convert the url to lowercase");

	it.todo("should highlight the link that matches the current route");
});
