import { ParsedUrlQuery } from "querystring";

import { type ISbStoryData } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { logger } from "@/logger";
import Mock404FromStoryblokApi from "@/test-utils/storyblok-not-found-response.json";
import MockServerErrorResponse from "@/test-utils/storyblok-server-error-response.json";
import mockBlogPostSuccessResponse from "@/test-utils/storyblok-single-blog-post-response.json";
import { BlogPostStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";
import { GENERIC_ERROR_MESSAGE } from "@/utils/storyblok";

import BlogPostPage, { getServerSideProps } from "./[slug].page";

//cast to unknown necessary due to some differences in response versus expected type from generate-ts
const mockBlogPost = mockBlogPostSuccessResponse.data
	.story as unknown as ISbStoryData<BlogPostStoryblok>;

const mockBreadcrumbs = [
	{ title: "News", path: "/news" },
	{ title: "Blogs", path: "/news/blogs" },
];

describe("BlogPostPage", () => {
	it("renders the page", () => {
		render(<BlogPostPage story={mockBlogPost} />);
		expect(screen.getByText(mockBlogPost.content.title)).toBeInTheDocument();

		expect(document.body).toMatchSnapshot();
	});

	it("should render error page if fetchStory returns error", async () => {
		const errorMessage = "An error returned from getserversideprops";
		const { asFragment } = render(<BlogPostPage error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("getServerSideProps", () => {
		let fetchStorySpy: jest.SpyInstance;
		beforeEach(() => {
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it("should return notFound when slug is not provided", async () => {
			const context = {
				query: {},
				params: {},
			} as GetServerSidePropsContext<ParsedUrlQuery>;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ notFound: true });
		});

		it("should return notFound when fetchStory returns notFound", async () => {
			fetchStorySpy.mockResolvedValue({ notFound: true });
			const context = {
				query: {},
				params: { slug: "slug-does-not-exist" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>;

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
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				{
					"Cache-Control-Request": mockContext.req.headers["cache-control"],
					errorCause: Mock404FromStoryblokApi,
					requestHeaders: mockContext.req.headers,
				},
				`Error fetching blog post at path ${mockContext.params?.slug} from gssp`
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
				params: { slug: "some-erroring-page" },
				req: {
					headers: {
						"cache-control":
							"public, s-max-age=300, max-age=120, stale-while-revalidate=1800",
					},
				},
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>;

			await getServerSideProps(mockContext);

			expect(logger.error).toHaveBeenCalled();
			expect(logger.error).toHaveBeenCalledWith(
				{
					"Cache-Control-Request": mockContext.req.headers["cache-control"],
					errorCause: MockServerErrorResponse,
					requestHeaders: mockContext.req.headers,
				},
				`Error fetching blog post at path ${mockContext.params?.slug} from gssp`
			);
		});

		it("should return error if fetchStory returns error", async () => {
			const mockErrorMessage =
				"There was an error fetching this story. Please try again later.";
			const mockCatchError = new Error(mockErrorMessage);

			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const result = await getServerSideProps({
				query: {},
				params: { slug: "some-erroring-page" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({ props: { error: GENERIC_ERROR_MESSAGE } });
		});

		it("should return a general error message if there is a throw that is not an Error object", async () => {
			const mockCatchError = "some string error";

			fetchStorySpy.mockRejectedValueOnce(mockCatchError);

			const result = await getServerSideProps({
				query: {},
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				props: {
					error: GENERIC_ERROR_MESSAGE,
				},
			});
		});

		it("should fetch story and return it with breadcrumbs when slug is provided", async () => {
			fetchStorySpy.mockResolvedValue({ story: mockBlogPost });

			const context = {
				query: { version: "published" },
				params: { slug: "test-slug" },
				req: { headers: {} },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(fetchStorySpy).toHaveBeenCalledWith(
				"news/blogs/test-slug",
				"published",
				{
					resolve_relations: "blogPost.author",
				}
			);

			expect(result).toEqual({
				props: {
					breadcrumbs: mockBreadcrumbs,
					story: mockBlogPost,
				},
			});
		});
	});
});
