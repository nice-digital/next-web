import { ISbStoryData } from "@storyblok/react";
import { GetServerSidePropsContext } from "next";

import { homepageHeroProps } from "@/components/Storyblok/Homepage/HomepageHero/HomepageHero.test";
import { logger } from "@/logger";
import { render, screen } from "@/test-utils/rendering";
import {
	mockStoryblokStory,
	mockNewsArticle,
	mockBlogPost,
	mockRichText,
} from "@/test-utils/storyblok-data";
import mockLatestNews from "@/test-utils/storyblok-homepage-latestnews-response.json";
import mockResult from "@/test-utils/storyblok-homepage-result.json";
import mockFetchStory from "@/test-utils/storyblok-homepage-storyResult-response.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import { NewsStory } from "@/types/News";
import * as storyblokUtils from "@/utils/storyblok";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

import Home, { type HomePageProps, getServerSideProps } from "./index.page";

// Mock a second article with a different ID so we avoid duplicate key warnings
const secondNewsArticle = {
	...mockNewsArticle,
	id: 987654321,
};

const latestNews: ISbStoryData<NewsStory>[] = [
	mockNewsArticle,
	mockBlogPost,
	secondNewsArticle,
];

const props: HomePageProps = {
	latestNews,
	story: {
		...mockStoryblokStory,
		content: {
			hero: [homepageHeroProps.blok],
			links: mockRichText,
			_uid: "12345789",
			component: "homepage",
		},
	},
};

const expectedErrorMessage = GENERIC_ERROR_MESSAGE;

describe("Homepage", () => {
	it("should match snapshot for main content", () => {
		const { container } = render(<Home {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("Should render error content when error is passed as a prop", async () => {
		const errorMessage = "An error returned from getserversideprops";
		const { asFragment } = render(<Home error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("getServerSideProps", () => {
		let fetchStoriesSpy: jest.SpyInstance;
		let fetchStorySpy: jest.SpyInstance;
		beforeEach(() => {
			fetchStoriesSpy = jest.spyOn(storyblokUtils, "fetchStories");
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2024-04-08"));
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it("should return error when fetchStory returns error", async () => {
			const mockErrorMessage =
				"<<<< There was an error fetching stories. Please try again later. >>>>> ";
			const mockCatchError = new Error(mockErrorMessage);

			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const context = {
				query: {},
				params: { slug: "home" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: expectedErrorMessage } });
		});

		it("should call fetchStories and fetchStory", async () => {
			fetchStoriesSpy.mockResolvedValueOnce(mockLatestNews);
			fetchStorySpy.mockResolvedValueOnce(mockFetchStory);

			const context = {
				query: {},
				params: { slug: "home" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(fetchStorySpy).toHaveBeenCalledTimes(1);
			expect(fetchStoriesSpy).toHaveBeenCalledTimes(1);
			expect(fetchStoriesSpy).toHaveBeenCalledWith("published", {
				excluding_ids: "430633954",
				excluding_slugs: "news/blogs/authors/*",
				filter_query: {
					date: {
						lt_date: "2024-04-08T00:00:00.000Z",
					},
				},
				per_page: 3,
				resolve_relations: "blogPost.author",
				sort_by: "content.date:desc",
				starts_with: "news",
			});

			expect(result).toEqual(mockResult);
		});

		it("should log and error if validateRouteParams throws an error", async () => {
			expect(jest.isMockFunction(logger.error)).toBe(true);
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage, {
				cause: MockServerErrorResponse,
			});

			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const mockContext = {
				query: {},
				params: { slug: "home" },
				req: {
					headers: {
						"cache-control":
							"public, s-max-age=300, max-age=120, stale-while-revalidate=1800",
					},
				},
			} as unknown as GetServerSidePropsContext;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				{
					errorCause: mockCatchError.cause,
					requestHeaders: mockContext.req.headers,
				},
				`Error fetching Homepage from gssp`
			);
		});

		it("should return error when fetchStories returns error", async () => {
			const mockErrorMessage =
				"<<<< There was an error fetching stories. Please try again later. >>>>> ";
			const mockCatchError = new Error(mockErrorMessage);

			fetchStoriesSpy.mockRejectedValueOnce(mockCatchError);

			const context = {
				query: {},
				params: { slug: "home" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: expectedErrorMessage } });
		});
	});
});
