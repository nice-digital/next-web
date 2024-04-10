import { render, screen } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";

import { NewsCard } from "./NewsCard";

describe("News card component", () => {
	it("should match snapshot for a news article", () => {
		const { container } = render(<NewsCard story={mockNewsArticle} />);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot for a blog post", () => {
		const { container } = render(<NewsCard story={mockBlogPost} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a 'News' tag if showing a news article", () => {
		render(<NewsCard story={mockNewsArticle} />);
		expect(screen.getByText("News")).toHaveClass("tag");
	});

	it("should render a 'Blog' tag if showing a blog post", () => {
		render(<NewsCard story={mockBlogPost} />);
		expect(screen.getByText("Blogs")).toHaveClass("tag");
	});

	it("should render a custom heading level if one is supplied", () => {
		render(<NewsCard story={mockNewsArticle} headingLevel={5} />);
		expect(
			screen.getByRole("heading", { level: 5, name: "Test news article title" })
		).toBeInTheDocument();
	});

	it("renders with default variant", () => {
		render(<NewsCard story={mockNewsArticle} />);
		const newsCardElement = screen.getByRole("article");
		expect(newsCardElement).toBeInTheDocument();
		expect(newsCardElement).not.toHaveClass("listItem");
	});

	it("renders with listItem class when 'isNewsListItem' variant is set", () => {
		render(<NewsCard story={mockNewsArticle} variant="isNewsListItem" />);
		const newsCardElement = screen.getByRole("article");
		expect(newsCardElement).toBeInTheDocument();
		expect(newsCardElement).toHaveClass("listItem");
	});

	it("should not render an image if showImage is false", () => {
		const { asFragment } = render(
			<NewsCard
				story={mockNewsArticle}
				variant="isNewsListItem"
				showImage={false}
			/>
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
