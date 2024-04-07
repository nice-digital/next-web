import { ParsedUrlQuery } from "querystring";

import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { StoryblokStory } from "storyblok-generate-ts";

import MockStoryblokResponse from "@/test-utils/storyblok-news-articles-listing.json";
import { NewsStory } from "@/types/News";

import {
	getServerSideProps,
	ArticlesIndexPage,
	NewsArticlesProps,
} from "./index.page";

const mockStories = MockStoryblokResponse.stories;

jest.mock("@storyblok/react", () => ({
	getStoryblokApi: jest.fn(),
}));

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

	describe("getServerSideProps", () => {
		beforeEach(() => {
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
				fetchStories: jest.fn().mockResolvedValue({
					stories: mockStories,
					total: mockStories.length,
					perPage: resultsPerPage,
				}),
			}));
		});

		it("should redirect to /news/articles if the page is less than 1", async () => {
			const result = await getServerSideProps({
				query: { page: "-1" },
				resolvedUrl: "/news/articles?page=-1",
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				redirect: {
					destination: "/news/articles",
					permanent: false,
				},
			});
		});
	});
});
