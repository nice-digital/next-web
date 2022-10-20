import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { PublicationsChapterMenu } from "./PublicationsChapterMenu";

const defaultProps = {
	chapters: [
		{
			title: "Test Chapter 1",
			url: "/ind1001/chapter/test-chapter-1",
		},
		{
			title: "Test Chapter 2",
			url: "/ind1001/chapter/test-chapter-2",
		},
	],
	productType: "IND",
	slug: "test001-test-product-title",
};

describe("PublicationsChapterMenu", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({}));
	});

	it("should match the snapshot", () => {
		expect(
			render(<PublicationsChapterMenu {...defaultProps} />).container
		).toMatchSnapshot();
	});

	it.each([
		["Test Chapter 1", "/ind1001/chapter/test-chapter-1"],
		["Test Chapter 2", "/ind1001/chapter/test-chapter-2"],
	])("should render chapter heading %s with link to %s", (linkText, href) => {
		render(<PublicationsChapterMenu {...defaultProps} />);
		const link = screen.getByRole("link", { name: linkText });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
	});

	it("should highlight the link that matches the current route", () => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			asPath: "/ind1001/chapter/test-chapter-2",
		}));
		render(<PublicationsChapterMenu {...defaultProps} />);

		expect(
			screen.getByRole("link", { name: "Test Chapter 1" })
		).not.toHaveAttribute("aria-current", "true");

		expect(
			screen.getByRole("link", { name: "Test Chapter 2" })
		).toHaveAttribute("aria-current", "true");
	});
});
