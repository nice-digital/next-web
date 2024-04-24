import { render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import MockStoryblokSuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";

import {
	getServerSideProps,
	NewsIndexPage,
	NewsIndexProps,
} from "./index.page";

const mockStories = MockStoryblokSuccessResponse.data.stories;

describe("/news/index.page", () => {
	(useRouter as jest.Mock).mockReturnValue({
		route: "/news",
		pathname: "/news",
		query: { page: "1" },
		asPath: "/news",
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
		push: jest.fn(),
	});

	// newsArticles: StoryblokStory<NewsArticleStoryblok>[];
	// inDepthArticles: StoryblokStory<InDepthArticleStoryblok>[];
	// blogPosts: StoryblokStory<BlogPostStoryblok>[];
	// podcasts: StoryblokStory<PodcastStoryblok>[];

	const mockConfig = {
		newsArticles: [],
		inDepthArticles: [],
		blogPosts: [],
		podcasts: [],
	};

	const mockProps = {};

	describe("NewsIndexPage", () => {
		it("should match snapshot for main content", () => {
			render(<NewsIndexPage {...mockProps} />);
			expect(document.body).toMatchSnapshot();
		});
	});

	describe("getServerSideProps", () => {
		it.todo("write some tests for getServerSideProps");
	});
});
