import { render, screen } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";

import { NewsGrid } from "./NewsGrid";

// Mock a second article with a different ID so we avoid duplicate key warnings
const secondNewsArticle = {
	...mockNewsArticle,
	id: 987654321,
};

const latestNews = [mockNewsArticle, mockBlogPost, secondNewsArticle];

describe("Homepage latest news component", () => {
	it("should match snapshot", () => {
		const { container } = render(<NewsGrid news={latestNews} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a list item for each story supplied", () => {
		render(<NewsGrid news={latestNews} />);
		expect(screen.getAllByRole("listitem")).toHaveLength(latestNews.length);
	});
});
