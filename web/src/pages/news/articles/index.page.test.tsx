import { ParsedUrlQuery } from "querystring";

import { getStoryblokApi } from "@storyblok/react";
import { render } from "@testing-library/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { StoryblokStory } from "storyblok-generate-ts";

import MockStoryblokSuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";
import { NewsStory } from "@/types/News";

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
		query: { page: "1" },
		asPath: "/news/articles?page=1",
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

		it("should return notFound when page is less than 1", async () => {
			const result = await getServerSideProps({
				query: { page: "-1" },
				resolvedUrl: "/news/articles?page=-1",
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				notFound: true,
			});
		});

		it("should return notFound if pagination page is out of range", async () => {
			const result = await getServerSideProps({
				query: { page: "30" },
				resolvedUrl: "/news/articles?page=30",
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				notFound: true,
			});
		});

		it.todo("should call validateRouteParams with correct params");
		it.todo("should return notFound if validateRouteParams returns notFound");
		it.todo("should return redirect if validateRouteParams returns redirect");
		it.todo("should return error if validateRouteParams returns error");
		it.todo(
			"should return a correct props object if validateRouteParams returns success"
		);
		it.todo("should render error page if validateRouteParams returns error");
		it.todo("should render a page header");
		it.todo("should render breadcrumbs");
		it.todo("should render a list of stories");
		it.todo("should render news navigation");
		it.todo("should render a hidden heading for screen readers");
		it.todo("should have an announcer for screen readers");
		it.todo("should render no content message if no stories are returned");
		it.todo("should render a featured story if one is returned");
		it.todo("should not render a featured story if one is not returned");
		it.todo("should render an action banner");
		it.todo("should render a news list pagination component");
	});
});
