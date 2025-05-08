import { type ISbStoryData } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { logger } from "@/logger";
import { mockNewsArticle } from "@/test-utils/storyblok-data";
import Mock404FromStoryblokApi from "@/test-utils/storyblok-not-found-response.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import { NewsArticleStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

import NewsArticlePage, { getServerSideProps } from "./[slug].page";

const mockArticle = {
	...mockNewsArticle,
};

describe("NewsArticlePage", () => {
	it("renders the page", () => {
		render(
			<NewsArticlePage
				story={mockNewsArticle as ISbStoryData<NewsArticleStoryblok>}
			/>
		);
		expect(screen.getByText(mockNewsArticle.content.title)).toBeInTheDocument();
		expect(document.body).toMatchSnapshot();
	});

	it("should render error page if fetchStory returns error", async () => {
		const errorMessage = "An error returned from getserversideprops";
		const { asFragment } = render(<NewsArticlePage error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("getServerSideProps", () => {
		let fetchStorySpy: jest.SpyInstance;
		let getBreadcrumbs: jest.SpyInstance;
		beforeEach(() => {
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
			getBreadcrumbs = jest.spyOn(storyblokUtils, "getBreadcrumbs");
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it("returns notFound if no slug is provided", async () => {
			const context = { query: {}, params: {} } as GetServerSidePropsContext;
			const result = await getServerSideProps(context);
			expect(result).toEqual({ notFound: true });
		});

		it("should return notFound when fetchStory returns notFound", async () => {
			const mockCv = 123456789;
			jest.spyOn(storyblokUtils, "fetchCacheVersion").mockResolvedValue(mockCv);
			fetchStorySpy.mockResolvedValue({ notFound: true });
			const context = {
				query: {},
				params: { slug: "slug-does-not-exist" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ notFound: true });
		});

		it("should log error if fetchStory returns error if 404", async () => {
			expect(jest.isMockFunction(logger.error)).toBe(true);
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage, {
				cause: Mock404FromStoryblokApi,
			});
			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const mockContext = {
				query: {},
				params: { slug: "test-slug" },
				req: {
					headers: {
						"cache-control":
							"public, s-max-age=300, max-age=120, stale-while-revalidate=1800",
					},
					url: "/some-erroring-page",
				},
			} as unknown as GetServerSidePropsContext;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				// {
				// 	"Cache-Control-Request": mockContext.req.headers["cache-control"],
				// 	errorCause: Mock404FromStoryblokApi,
				// 	requestHeaders: mockContext.req.headers,
				// },
				`Error fetching news article at path ${mockContext.params?.slug} from gssp`
			);
		});

		it("should log error if fetchStory returns error if 503", async () => {
			expect(jest.isMockFunction(logger.error)).toBe(true);
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage, {
				cause: MockServerErrorResponse,
			});
			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const mockContext = {
				query: {},
				params: { slug: "test-slug" },
				req: {
					headers: {
						"cache-control":
							"public, s-max-age=300, max-age=120, stale-while-revalidate=1800",
					},
					url: "/some-erroring-page",
				},
			} as unknown as GetServerSidePropsContext;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				// {
				// 	"Cache-Control-Request": mockContext.req.headers["cache-control"],
				// 	errorCause: MockServerErrorResponse,
				// 	requestHeaders: mockContext.req.headers,
				// },
				`Error fetching news article at path ${mockContext.params?.slug} from gssp`
			);
		});

		it("should return an error if fetchStory returns an error", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(new Error(errorMessage));
			const context = {
				query: {},
				params: { slug: "some-erroring-page" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: GENERIC_ERROR_MESSAGE } });
		});

		it("should return a generic error message if fetchStory returns an error without a message", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(errorMessage);

			const context = {
				query: {},
				params: { slug: "some-erroring-page" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);
			expect(result).toEqual({
				props: {
					error: GENERIC_ERROR_MESSAGE,
				},
			});
		});

		it("should return the story and breadcrumbs", async () => {
			fetchStorySpy.mockResolvedValue({ story: mockArticle });
			getBreadcrumbs.mockResolvedValue([
				{ title: "Home", path: "/" },
				{ title: "News", path: "/news" },
				{ title: "Articles", path: "/news/articles" },
			]);
			const context = {
				query: {},
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({
				props: {
					story: mockArticle,
					breadcrumbs: [
						{ title: "Home", path: "/" },
						{ title: "News", path: "/news" },
						{ title: "News articles", path: "/news/articles" },
					],
				},
			});
		});
	});
});
