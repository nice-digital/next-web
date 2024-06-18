import { render, screen } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";

import { FeaturedStory } from "./FeaturedStory";

describe("Featured story component", () => {
	it("should match snapshot", () => {
		const { container } = render(<FeaturedStory story={mockNewsArticle} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a 'News' tag if showing a news article", () => {
		render(<FeaturedStory story={mockNewsArticle} />);
		expect(screen.getByText("News")).toHaveClass("tag");
	});

	it("should render a 'Blogs' tag if showing a blog post", () => {
		render(<FeaturedStory story={mockBlogPost} />);
		expect(screen.getByText("Blogs")).toHaveClass("tag");
	});

	it("should render a custom heading level if one is supplied", () => {
		render(<FeaturedStory story={mockNewsArticle} headingLevel={5} />);
		expect(
			screen.getByRole("heading", { level: 5, name: "Test news article title" })
		).toBeInTheDocument();
	});
});
