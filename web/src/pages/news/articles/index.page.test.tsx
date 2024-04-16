import { ParsedUrlQuery } from "querystring";

import { getStoryblokApi } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
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
		query: { page: "1" },
		asPath: "/news/articles?page=1",
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
		push: jest.fn(),
	});

	const mockConfig = {
		currentPage: 1,
		resultsPerPage: 6,
		startsWith: "news/articles/",
		query: {
			upperOutOfBoundPagination: "30",
			lowerOutOfBoundPagination: "-1",
			pageAt1: "1",
		},
		totalResults: 8,
	};

	const mockProps: NewsArticlesProps = {
		stories: mockStories as unknown as StoryblokStory<NewsStory>[],
		currentPage: mockConfig.currentPage,
		total: mockConfig.totalResults,
		perPage: mockConfig.resultsPerPage,
	};

	describe("ArticlesIndexPage", () => {
		it("should match snapshot for main content", () => {
			render(<ArticlesIndexPage {...mockProps} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render error page if validateRouteParams returns error", async () => {
			const errorMessage = "An error returned from getserversideprops";
			const { asFragment } = render(<ArticlesIndexPage error={errorMessage} />);

			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render a page header", async () => {
			render(<ArticlesIndexPage {...mockProps} />);

			expect(
				screen.getByRole("heading", { level: 1, name: "News articles" })
			).toBeInTheDocument();
		});

		it.todo("should render breadcrumbs", () => {
			render(<ArticlesIndexPage {...mockProps} />);
			expect(screen.getByText("Home")).toBeInTheDocument();
			// <ol class="breadcrumbs"><li class="breadcrumbs__crumb"><a href="/">Home</a></li><li class="breadcrumbs__crumb"><a href="/news">News</a></li><li class="breadcrumbs__crumb"><span>Articles</span></li></ol>
		});
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

	describe("getServerSideProps", () => {
		let validateRouteParamsSpy: jest.SpyInstance;
		beforeEach(() => {
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
			}));

			validateRouteParamsSpy = jest.spyOn(
				storyblokUtils,
				"validateRouteParams"
			);

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
				query: { page: mockConfig.query.lowerOutOfBoundPagination },
				resolvedUrl: `${mockConfig.startsWith}?page=${mockConfig.query.lowerOutOfBoundPagination}`,
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				notFound: true,
			});
		});

		it("should return notFound if pagination page is out of range", async () => {
			const result = await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
				resolvedUrl: `${mockConfig.startsWith}?page=${mockConfig.query.upperOutOfBoundPagination}`,
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				notFound: true,
			});
		});

		it("should call validateRouteParams with correct params", async () => {
			await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(validateRouteParamsSpy).toHaveBeenCalledWith({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
				sbParams: {
					starts_with: mockConfig.startsWith,
					per_page: mockConfig.resultsPerPage,
				},
			});
		});

		it("should return notFound if validateRouteParams returns notFound", async () => {
			validateRouteParamsSpy.mockResolvedValue({ notFound: true });

			const result = await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({ notFound: true });
		});

		it("should return redirect if validateRouteParams returns redirect", async () => {
			const mockRedirect = {
				redirect: { destination: "/news/articles", permanent: false },
			};

			validateRouteParamsSpy.mockResolvedValue(mockRedirect);

			const result = await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual(mockRedirect);
		});
		it("should return error if validateRouteParams returns error", async () => {
			const mockErrorMessage =
				"<<<< There was an error fetching stories. Please try again later. >>>>> ";
			const mockCatchError = new Error(mockErrorMessage);

			validateRouteParamsSpy.mockRejectedValue(mockCatchError);

			const result = await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({ props: { error: mockErrorMessage } });
		});

		it("should return a general error message if there is a throw that is not an Error object", async () => {
			const mockCatchError = "some string error";

			validateRouteParamsSpy.mockRejectedValue(mockCatchError);

			const result = await getServerSideProps({
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				props: { error: "an unspecified error occurred" },
			});
		});

		it("should return a correct props object if validateRouteParams returns success", async () => {
			const mockValidatedRouteParamsSuccessResponse = {
				featuredStory: mockStories[0],
				stories: mockStories.slice(1),
				total: MockStoryblokSuccessResponse.total,
				currentPage: mockConfig.currentPage,
				perPage: MockStoryblokSuccessResponse.perPage,
			};
			// MockStoryblokSuccessResponse
			validateRouteParamsSpy.mockResolvedValue(
				mockValidatedRouteParamsSuccessResponse
			);

			const result = await getServerSideProps({
				query: { page: mockConfig.query.pageAt1 },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				props: {
					featuredStory: MockStoryblokSuccessResponse.data.stories[0],
					stories: MockStoryblokSuccessResponse.data.stories.slice(1),
					perPage: MockStoryblokSuccessResponse.perPage,
					total: MockStoryblokSuccessResponse.total,
					currentPage: 1,
				},
			});
		});
	});
});
