import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsStory } from "@/types/News";

import { ArticlesIndexPage, NewsArticlesProps } from "./index.page";
import mockStory from "./mockStory.json";

jest.mock("@storyblok/react", () => ({
	getStoryblokApi: jest.fn(),
}));

jest.mock("@/utils/storyblok", () => ({
	friendlyDate: jest.fn().mockReturnValue("10 January 2024"),
}));

describe("/news/articles/index.page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			route: "/news/articles",
			pathname: "/news/articles",
			query: { page: "1" },
			asPath: "/news/articles",
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
			push: jest.fn(),
		});
	});

	afterEach(() => jest.clearAllMocks());

	// const mockfetchStoriesResponse: SBMultipleResponse<T> = {
	// 	stories: [],
	// 	perPage: 3,
	// 	total: 5,
	// };

	const mockStories = [
		{
			...mockStory,
			name: "Test featured story 1",
			id: 1,
			content: {
				...mockStory.content,
				date: "2024-01-10",
				component: "newsArticle",
			},
		},
		{
			...mockStory,
			name: "Test story 2",
			id: 2,
			content: {
				...mockStory.content,
				date: "2023-12-25",
				component: "newsArticle",
			},
		},
		{
			...mockStory,
			name: "Test story 3",
			id: 3,
			content: {
				...mockStory.content,
				date: "2023-8-11",
				component: "newsArticle",
			},
		},
		{
			...mockStory,
			name: "Test story 4",
			id: 4,
			content: { ...mockStory.content, date: "2023-06-18" },
		},
		{
			...mockStory,
			name: "Test story 5",
			id: 5,
			content: { ...mockStory.content, date: "2023-02-07" },
		},
		{
			...mockStory,
			name: "Test story 6",
			id: 6,
			content: { ...mockStory.content, date: "2023-01-25" },
		},
		{
			...mockStory,
			name: "Test story 7",
			id: 7,
			content: { ...mockStory.content, date: "2023-01-15" },
		},
		{
			...mockStory,
			name: "Test story 8",
			id: 8,
			content: { ...mockStory.content, date: "2023-01-05" },
		},
	];

	const mockFeaturedStory = {
		...mockStories[0],
		name: "Featured story",
		content: {
			...mockStories[0].content,
			date: "2024-01-10",
			component: "newsArticle",
		},
	};

	const resultsPerPage = 6;
	const totalResults = 8;
	let currentPage = 1;
	const mockProps: NewsArticlesProps = {
		stories: mockStories.slice(
			0,
			resultsPerPage
		) as unknown as StoryblokStory<NewsStory>[],
		currentPage,
		totalResults,
		resultsPerPage,
		featuredStory: mockFeaturedStory as unknown as StoryblokStory<NewsStory>,
	};

	it("should match snapshot for main content", () => {
		render(<ArticlesIndexPage {...mockProps} />);
		expect(document.body).toMatchSnapshot();
	});

	it("should not render a featured story if the page is > 1", () => {
		// useRouter mock to return page 2
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
		currentPage = 2;
		const props = {
			...mockProps,
			currentPage: 2,
			featuredStory: null,
		};

		render(<ArticlesIndexPage {...props} />);
		expect(screen.queryByText("Featured story")).toBeNull();
	});
});
