import { ParsedUrlQuery } from "querystring";

import { getStoryblokApi } from "@storyblok/react";
import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { StoryblokStory } from "storyblok-generate-ts";

import MockStoryblokSuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";
import { NewsStory } from "@/types/News";
import * as storyblokUtils from "@/utils/storyblok";

import {
	getServerSideProps,
	ArticlesIndexPage,
	NewsArticlesProps,
} from "./index.page";

const mockStories = MockStoryblokSuccessResponse.data.stories;

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
		const fetchStoriesSpy = jest.spyOn(storyblokUtils, "fetchStories");

		beforeEach(() => {
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
			}));

			getStoryblokApi().get = jest
				.fn()
				.mockResolvedValue(MockStoryblokSuccessResponse);

			jest.useFakeTimers();
			jest.setSystemTime(new Date("2024-04-08"));
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it("should call fetchStories at page 1 when less than 1 passed as query.page", async () => {
			await getServerSideProps({
				query: { page: "-1" },
				resolvedUrl: "/news/articles?page=-1",
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(fetchStoriesSpy).toHaveBeenCalled();
			expect(fetchStoriesSpy).toHaveBeenCalledWith("published", {
				filter_query: {
					date: {
						lt_date: new Date().toISOString(),
					},
				},
				page: 1,
				per_page: 6,
				sort_by: "content.date:desc",
				starts_with: "news/articles/",
			});
		});

		it("should redirect to /news/articles if the page is out of range", async () => {
			const result = await getServerSideProps({
				query: { page: "30" },
				resolvedUrl: "/news/articles?page=30",
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
