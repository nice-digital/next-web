import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import {
	mockBlogPost,
	mockIndepthArticle,
	mockNewsArticle,
	mockPodcastPage,
} from "@/test-utils/storyblok-data";
import * as storyblokUtils from "@/utils/storyblok";

import {
	getServerSideProps,
	NewsIndexPage,
	NewsIndexProps,
} from "./index.page";

const mockProps: NewsIndexProps = {
	newsArticles: [mockNewsArticle],
	inDepthArticles: [mockIndepthArticle],
	blogPosts: [mockBlogPost],
	podcasts: [mockPodcastPage],
};
const expectedErrorMessage =
	"Oops! Something went wrong and we're working to fix it. Please try again later.";

// Example data for successful fetch
const mockNewsArticles = { stories: [mockNewsArticle] };
const mockInDepthArticles = { stories: [mockIndepthArticle] };
const mockBlogPosts = { stories: [mockBlogPost] };
const mockPodcasts = { stories: [mockPodcastPage] };

describe("getServerSideProps", () => {
	let fetchStoriesSpy: jest.SpyInstance;
	beforeEach(() => {
		fetchStoriesSpy = jest.spyOn(storyblokUtils, "fetchStories");
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("returns error props if any fetch fails", async () => {
		const error = new Error("Network error");
		fetchStoriesSpy
			.mockRejectedValueOnce(error)
			.mockResolvedValueOnce(mockInDepthArticles)
			.mockResolvedValueOnce(mockBlogPosts)
			.mockResolvedValueOnce(mockPodcasts);

		const context = {
			query: {},
			params: { slug: "test-slug" },
		} as unknown as GetServerSidePropsContext;

		const response = await getServerSideProps(context);

		expect(response).toEqual({
			props: {
				error:
					"Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		});
	});
});

describe("/news/index.page", () => {
	describe("NewsIndexPage", () => {
		(useRouter as jest.Mock).mockReturnValue({
			route: "/news",
			pathname: "/news",
			query: {},
			asPath: "/news",
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
			push: jest.fn(),
		});
		it("should match snapshot for main content", () => {
			render(<NewsIndexPage {...mockProps} />);
			expect(document.body).toMatchSnapshot();
		});

		it("Should render error content when error is passed as a prop", async () => {
			const errorMessage = "An error returned from getserversideprops";
			const { asFragment } = render(<NewsIndexPage error={errorMessage} />);

			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("getServerSideProps", () => {
		let fetchStoriesSpy: jest.SpyInstance;
		beforeEach(() => {
			fetchStoriesSpy = jest.spyOn(storyblokUtils, "fetchStories");
		});
		afterEach(() => {
			jest.clearAllMocks();
		});
		//return success when fetchStories returns success

		it("should return error when fetchStories returns error", async () => {
			const mockErrorMessage =
				"<<<< There was an error fetching stories. Please try again later. >>>>> ";
			const mockCatchError = new Error(mockErrorMessage);

			fetchStoriesSpy.mockRejectedValueOnce(mockCatchError);

			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: expectedErrorMessage } });
		});

		//return error when stories are empty
		it("should return error when stories are empty", async () => {
			fetchStoriesSpy.mockResolvedValue({ stories: [] });

			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: expectedErrorMessage } });
		});

		it("returns props on successful fetches", async () => {
			fetchStoriesSpy
				.mockResolvedValueOnce(mockNewsArticles)
				.mockResolvedValueOnce(mockInDepthArticles)
				.mockResolvedValueOnce(mockBlogPosts)
				.mockResolvedValueOnce(mockPodcasts);

			const context = { query: {} }; // Mock your context accordingly
			const response = await getServerSideProps(
				context as unknown as GetServerSidePropsContext
			);

			expect(response).toEqual({
				props: {
					newsArticles: mockNewsArticles.stories,
					inDepthArticles: mockInDepthArticles.stories,
					blogPosts: mockBlogPosts.stories,
					podcasts: mockPodcasts.stories,
				},
			});
		});

		it("should return an error if any fetch returns an empty array", async () => {
			fetchStoriesSpy
				.mockResolvedValueOnce(mockNewsArticles)
				.mockResolvedValueOnce({ stories: [] })
				.mockResolvedValueOnce(mockBlogPosts)
				.mockResolvedValueOnce(mockPodcasts);

			const context = { query: {} };
			const response = await getServerSideProps(
				context as unknown as GetServerSidePropsContext
			);

			expect(response).toEqual({
				props: {
					error: expectedErrorMessage,
				},
			});
		});
	});
});
