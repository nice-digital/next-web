import { ParsedUrlQuery } from "querystring";

import { getStoryblokApi, ISbStoryData } from "@storyblok/react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";

import { logger } from "@/logger";
import MockStoryblokSuccessResponse from "@/test-utils/storyblok-news-articles-listing.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import { NewsStory } from "@/types/News";
import * as storyblokUtils from "@/utils/storyblok";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

import {
	getServerSideProps,
	InDepthArticleIndexPage,
	InDepthArticleProps,
} from "./index.page";

const mockStories = MockStoryblokSuccessResponse.data.stories;

describe("/news/in-depth/index.page", () => {
	(useRouter as jest.Mock).mockReturnValue({
		route: "/news/in-depth",
		pathname: "/news/in-depth",
		query: { page: "1" },
		asPath: "/news/in-depth?page=1",
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
		startsWith: "news/in-depth/",
		query: {
			upperOutOfBoundPagination: "30",
			lowerOutOfBoundPagination: "-1",
			pageAt1: "1",
		},
		totalResults: 8,
	};

	const mockProps: InDepthArticleProps = {
		stories: mockStories as unknown as ISbStoryData<NewsStory>[],
		currentPage: mockConfig.currentPage,
		total: mockConfig.totalResults,
		perPage: mockConfig.resultsPerPage,
	};

	describe("InDepthArticleIndexPage", () => {
		it("should match snapshot for main content", () => {
			render(<InDepthArticleIndexPage {...mockProps} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render error page if validateRouteParams returns error", async () => {
			const errorMessage = "An error returned from getserversideprops";
			const { asFragment } = render(
				<InDepthArticleIndexPage error={errorMessage} />
			);

			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render a page header", async () => {
			render(<InDepthArticleIndexPage {...mockProps} />);

			expect(
				screen.getByRole("heading", { level: 1, name: "In-depth" })
			).toBeInTheDocument();
		});

		it("should render breadcrumbs", () => {
			render(<InDepthArticleIndexPage {...mockProps} />);
			const navElement = screen.getByRole("navigation", {
				name: "Breadcrumbs",
			});
			const breadcrumbLinks = within(navElement).getAllByRole("link");
			expect(navElement).toBeInTheDocument();
			expect(breadcrumbLinks.length).toBe(2);
		});

		it("should render no content message if no stories are returned", () => {
			const mockPropsNoStories = {
				...mockProps,
				stories: [],
			};

			render(<InDepthArticleIndexPage {...mockPropsNoStories} />);

			expect(
				screen.getByText("Sorry there are no news articles available")
			).toBeInTheDocument();
		});

		it("should render a featured story if one is returned", () => {
			const mockPropsWithFeaturedStory = {
				...mockProps,
				featuredStory: mockProps.stories[0],
				stories: mockProps.stories.slice(1),
			};
			mockPropsWithFeaturedStory.featuredStory.name = "Featured story";

			render(<InDepthArticleIndexPage {...mockPropsWithFeaturedStory} />);

			expect(screen.getByText("Featured story")).toBeInTheDocument();
		});

		it("should render news navigation", () => {
			render(<InDepthArticleIndexPage {...mockProps} />);
			const navElement = screen.getByRole("navigation", {
				name: "News section navigation",
			});
			const newsNaviagtionLinks = within(navElement).getAllByRole("link");
			expect(navElement).toBeInTheDocument();
			expect(newsNaviagtionLinks.length).toBe(5);
		});

		it("should render an action banner for newsletters and alerts", () => {
			render(<InDepthArticleIndexPage {...mockProps} />);
			expect(
				screen.getByText("Sign up for our newsletters and alerts")
			).toBeInTheDocument();
		});

		it("should render a news list pagination component", () => {
			const { container } = render(<InDepthArticleIndexPage {...mockProps} />);
			const totalPages = Math.ceil(
				mockConfig.totalResults / mockConfig.resultsPerPage
			);
			expect(container.textContent).toHaveTextContentIgnoreTags(
				`Page ${mockConfig.currentPage} of ${totalPages}`
			);
		});

		describe("Accessibility features", () => {
			it("should render a hidden focusable heading for screen readers", () => {
				render(<InDepthArticleIndexPage {...mockProps} />);
				const hiddenFocusableHeading = screen.getByRole("heading", {
					level: 2,
					name: "In-depth articles list",
				});
				expect(hiddenFocusableHeading).toBeInTheDocument();
				expect(hiddenFocusableHeading).toHaveClass("visually-hidden");
			});
			it("should have an announcer for screen readers", async () => {
				const announcer = document.createElement("div");
				announcer.id = "__next-route-announcer__";
				announcer.setAttribute("aria-live", "assertive");
				announcer.setAttribute("role", "alert");
				document.body.appendChild(announcer);
				render(<InDepthArticleIndexPage {...mockProps} />);

				await waitFor(() =>
					expect(screen.getByRole("alert")).toHaveTextContent(
						"In-depth article listing page, 1 of 2"
					)
				);

				announcer.remove();
			});
		});
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

		it("should log and error if validateRouteParams throws an error", async () => {
			expect(jest.isMockFunction(logger.error)).toBe(true);
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage, {
				cause: MockServerErrorResponse,
			});

			validateRouteParamsSpy.mockRejectedValue(mockCatchError);

			const mockContext = {
				query: { page: mockConfig.query.upperOutOfBoundPagination },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				{
					errorCause: mockCatchError.cause,
					requestHeaders: mockContext.req.headers,
				},
				`Error fetching in-depth article listing at page ${mockConfig.query.upperOutOfBoundPagination} from gssp`
			);
		});

		it("should return error if validateRouteParams returns error", async () => {
			const mockErrorMessage =
				"<<<< There was an error fetching stories. Please try again later. >>>>> ";
			const mockCatchError = new Error(mockErrorMessage);

			validateRouteParamsSpy.mockRejectedValue(mockCatchError);

			const mockContext = {
				req: { headers: {} },
				params: {},
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(mockContext);

			expect(result).toEqual({ props: { error: GENERIC_ERROR_MESSAGE } });
		});

		it("should return a general error message if there is a throw that is not an Error object", async () => {
			const mockCatchError = "some string error";

			validateRouteParamsSpy.mockRejectedValue(mockCatchError);

			const mockContext = {
				req: { headers: {} },
				params: {},
				query: { page: mockConfig.query.upperOutOfBoundPagination },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(mockContext);

			expect(result).toEqual({
				props: {
					error: GENERIC_ERROR_MESSAGE,
				},
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
