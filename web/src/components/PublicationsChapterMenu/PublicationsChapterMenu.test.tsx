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
		// (useRouter as jest.Mock).mockImplementation(() => ({
		// 	route: "/indicators/[slug]",
		// 	pathname: "/indicators/test001-test-product-title",
		// 	query: { slug: "/indicators/test001-test-product-title" },
		// 	asPath: "/indicators/test001-test-product-title",
		// }));
	});

	it("should match the snapshot", () => {
		expect(
			render(<PublicationsChapterMenu {...defaultProps} />).container
		).toMatchSnapshot();
	});

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
		const link = screen.getByRole("link", { name: linkText });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
	});

	it("should render links starting with correct product type path", () => {
		render(<PublicationsChapterMenu {...defaultProps} />);

		//TODO is this a worthwhile test and can this be done without direct node access
		const href = screen
			.getByRole("link", { name: "Test Chapter 2" })
			.closest("a")
			?.getAttribute("href");

		expect(href && href.startsWith("/indicators/", 0)).toBe(true);
	});

	it("should convert the url to lowercase", () => {
		render(
			<PublicationsChapterMenu
				{...defaultProps}
				chapters={[
					{
						title: "Test Chapter 1",
						url: "/ind1001/CHAPTER/TeSt-CHAPTER-1",
					},
				]}
			/>
		);

		expect(
			screen.getByRole("link", { name: "Test Chapter 1" })
		).toHaveAttribute(
			"href",
			"/indicators/test001-test-product-title/chapters/test-chapter-1"
		);
	});

	it.todo("should highlight the link that matches the current route");
});
