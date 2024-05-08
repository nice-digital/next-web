import { ParsedUrlQuery } from "querystring";

import { getStoryblokApi } from "@storyblok/react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { StoryblokStory } from "storyblok-generate-ts";

import MockStoryblokSuccessResponse from "@/test-utils/storyblok-podcasts--listing-response.json";
import { NewsStory } from "@/types/News";
import * as storyblokUtils from "@/utils/storyblok";

import {
	getServerSideProps,
	PodcastIndexPage,
	PodcastPostsProps,
} from "./index.page";

const mockStories = MockStoryblokSuccessResponse.data.stories;

describe("/news/podcasts/index.page", () => {
	(useRouter as jest.Mock).mockReturnValue({
		route: "/news/podcasts",
		pathname: "/news/podcasts",
		query: { page: "1" },
		asPath: "/news/podcasts?page=1",
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
		startsWith: "news/podcasts/",
		query: {
			upperOutOfBoundPagination: "30",
			lowerOutOfBoundPagination: "-1",
			pageAt1: "1",
		},
		totalResults: 8,
	};

	const mockProps: PodcastPostsProps = {
		stories: mockStories as unknown as StoryblokStory<NewsStory>[],
		currentPage: mockConfig.currentPage,
		total: mockConfig.totalResults,
		perPage: mockConfig.resultsPerPage,
	};

	describe("PodcastsIndexPage", () => {
		it("should match snapshot for main content", () => {
			render(<PodcastIndexPage {...mockProps} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render error page if validateRouteParams returns error", async () => {
			const errorMessage = "An error returned from getserversideprops";
			const { asFragment } = render(<PodcastIndexPage error={errorMessage} />);

			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(asFragment()).toMatchSnapshot();
		});

		it("should render a page header", async () => {
			render(<PodcastIndexPage {...mockProps} />);

			expect(
				screen.getByRole("heading", { level: 1, name: "Podcasts" })
			).toBeInTheDocument();
		});

		it("should render breadcrumbs", () => {
			render(<PodcastIndexPage {...mockProps} />);
			const navElement = screen.getByRole("navigation", {
				name: "Breadcrumbs",
			});
			const breadcrumbLinks = within(navElement).getAllByRole("link");
			expect(navElement).toBeInTheDocument();
			expect(breadcrumbLinks.length).toBe(2);
		});

		it("should render no content message if no podcasts are returned", () => {
			const mockPropsNoStories = {
				...mockProps,
				stories: [],
			};

			render(<PodcastIndexPage {...mockPropsNoStories} />);

			expect(
				screen.getByText("Sorry there are no podcasts available")
			).toBeInTheDocument();
		});

		it("should render news navigation", () => {
			render(<PodcastIndexPage {...mockProps} />);
			const navElement = screen.getByRole("navigation", {
				name: "News section navigation",
			});
			const newsNaviagtionLinks = within(navElement).getAllByRole("link");
			expect(navElement).toBeInTheDocument();
			expect(newsNaviagtionLinks.length).toBe(5);
		});

		it("should render an action banner for newsletters and alerts", () => {
			render(<PodcastIndexPage {...mockProps} />);
			expect(
				screen.getByText("Sign up for our newsletters and alerts")
			).toBeInTheDocument();
		});

		it("should render a news list pagination component", () => {
			const { container } = render(<PodcastIndexPage {...mockProps} />);
			const totalPages = Math.ceil(
				mockConfig.totalResults / mockConfig.resultsPerPage
			);
			expect(container.textContent).toHaveTextContentIgnoreTags(
				`Page ${mockConfig.currentPage} of ${totalPages}`
			);
		});

		it("should render an 'other ways to listen' panel", () => {
			render(<PodcastIndexPage {...mockProps} />);
			const panelHeading = screen.getByRole("heading", {
				level: 2,
				name: "Other ways to listen",
			});
			expect(panelHeading).toBeInTheDocument();

			// eslint-disable-next-line testing-library/no-node-access
			const panel = panelHeading.closest(".panel");
			expect(panel).toBeInTheDocument();
		});

		describe("Accessibility features", () => {
			it("should render a hidden focusable heading for screen readers", () => {
				render(<PodcastIndexPage {...mockProps} />);
				const hiddenFocusableHeading = screen.getByRole("heading", {
					level: 2,
					name: "Podcast list",
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
				render(<PodcastIndexPage {...mockProps} />);

				await waitFor(() =>
					expect(screen.getByRole("alert")).toHaveTextContent(
						"Podcast listing page, 1 of 2"
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
				props: {
					error:
						"Oops! Something went wrong and we're working to fix it. Please try again later.",
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
					stories: MockStoryblokSuccessResponse.data.stories,
					perPage: MockStoryblokSuccessResponse.perPage,
					total: MockStoryblokSuccessResponse.total,
					currentPage: 1,
				},
			});
		});

		it("should return a correct props object if validateRouteParams returns success and page is not equal to 1", async () => {
			const notPageOne = "2";
			const mockValidatedRouteParamsSuccessResponse = {
				stories: mockStories,
				total: MockStoryblokSuccessResponse.total,
				currentPage: 2,
				perPage: MockStoryblokSuccessResponse.perPage,
			};

			validateRouteParamsSpy.mockResolvedValue(
				mockValidatedRouteParamsSuccessResponse
			);

			const result = await getServerSideProps({
				query: { page: notPageOne },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				props: mockValidatedRouteParamsSuccessResponse,
			});
		});
	});
});
