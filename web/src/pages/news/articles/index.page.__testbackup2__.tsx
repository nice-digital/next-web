import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import { mockNewsArticle as mockStory } from "@/test-utils/storyblok-data";
import { NewsStory } from "@/types/News";

import { ArticlesIndexPage, NewsArticlesProps } from "./index.page";

describe("/news/articles/index.page", () => {
	(useRouter as jest.Mock).mockReturnValue({
		route: "/news/articles",
		pathname: "/news/articles",
		query: { page: "2" },
		asPath: "/news/articles?page=2",
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
		push: jest.fn(),
	});
	const generateStory = (
		id: number,
		name: string,
		date: string,
		component = "newsArticle"
	) => ({
		...mockStory,
		name,
		id,
		content: {
			...mockStory.content,
			date,
			component,
		},
	});

	const mockStories = Array.from({ length: 8 }, (_, i) =>
		generateStory(i + 1, `Test story ${i + 1}`, `2023-0${i + 1}-10`)
	);

	// const mockFeaturedStory = generateStory(0, "Featured story", "2024-01-10");

	const resultsPerPage = 6;
	const totalResults = 8;
	const currentPage = 2;
	const mockProps: NewsArticlesProps = {
		stories: Array.from(
			{ length: 2 },
			(_, i) => mockStories[i] as unknown as StoryblokStory<NewsStory>
		), // limit number in array to mimic fetchStories resultsPerPage option in prop,
		currentPage,
		total: totalResults,
		perPage: resultsPerPage,
	};

	it("should match snapshot for main content", () => {
		render(<ArticlesIndexPage {...mockProps} />);
		expect(document.body).toMatchSnapshot();
	});
});
