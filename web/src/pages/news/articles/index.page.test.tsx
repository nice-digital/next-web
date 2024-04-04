import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import { mockNewsArticle as mockStory } from "@/test-utils/storyblok-data";
import MockStoryblokResponse from "@/test-utils/storyblok-news-articles-listing.json";
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

	const mockStories = MockStoryblokResponse.stories;

	const resultsPerPage = 6;
	const totalResults = 8;
	const currentPage = 1;
	const mockProps: NewsArticlesProps = {
		stories: mockStories as unknown as StoryblokStory<NewsStory>[],
		currentPage,
		total: totalResults,
		perPage: resultsPerPage,
	};

	it("should match snapshot for main content", () => {
		render(<ArticlesIndexPage {...mockProps} />);
		expect(document.body).toMatchSnapshot();
	});
});
