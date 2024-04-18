import { ParsedUrlQuery } from "querystring";

import { ISbStoryData, getStoryblokApi } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import Mock404FromStoryblokApi from "@/test-utils/storyblok-not-found-response.json";
import mockBlogPostSuccessResponse from "@/test-utils/storyblok-single-blog-post-response.json";
import { BlogPostStoryblok } from "@/types/storyblok";
import * as storyblokUtils from "@/utils/storyblok";

import BlogPostPage, { getServerSideProps } from "./[slug].page";

//TODO check the shape of the mock success response data as conversion to unknown is a bit of a code smell
const mockBlogPost = mockBlogPostSuccessResponse.data
	.story as unknown as ISbStoryData<BlogPostStoryblok>;

const mockBreadcrumbs = [
	{ title: "News", path: "/news" },
	{ title: "Blogs", path: "/news/blogs" },
];

describe("BlogPostPage", () => {
	(useRouter as jest.Mock).mockReturnValue({
		route: "/news/blogs/test-slug",
		pathname: "/news/blogs/test-slug",
		query: { page: "1" },
		asPath: "/news/blogs/test-slug",
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		},
		push: jest.fn(),
	});
	it("renders the page", () => {
		render(<BlogPostPage story={mockBlogPost} />);
		expect(
			screen.getByText(mockBlogPostSuccessResponse.data.story.content.title)
		).toBeInTheDocument();

		//TODO added a snapshot - better than checking for title?
		expect(document.body).toMatchSnapshot();
	});

	it("should render error page if validateRouteParams returns error", async () => {
		const errorMessage = "An error returned from getserversideprops";
		const { asFragment } = render(<BlogPostPage error={errorMessage} />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("Author content", () => {
		it("should render the authors name", () => {
			render(<BlogPostPage story={mockBlogPost} />);
			expect(
				screen.getByRole("heading", {
					level: 2,
					name: mockBlogPostSuccessResponse.data.story.content.author[0].name,
				})
			).toBeInTheDocument();
		});
		it("should render the author's job title", () => {
			render(<BlogPostPage story={mockBlogPost} />);
			expect(
				screen.getByText(
					mockBlogPostSuccessResponse.data.story.content.author[0].content
						.jobTitle
				)
			).toBeInTheDocument();
		});
	});

	it("should render an action banner for newsletters and alerts", () => {
		render(<BlogPostPage story={mockBlogPost} />);
		expect(
			screen.getByText("Sign up for our newsletters and alerts")
		).toBeInTheDocument();
	});
});

//TODO should this be inside the describe block above?
describe("getServerSideProps", () => {
	let fetchStorySpy: jest.SpyInstance;
	beforeEach(() => {
		jest.mock("@/utils/storyblok", () => ({
			...jest.requireActual("@/utils/storyblok"),
			getSlugFromParams: jest.fn().mockReturnValueOnce("test-slug"),
			getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
			fetchStory: jest.fn().mockResolvedValue(mockBlogPost),
		}));

		fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");

		getStoryblokApi().get = jest
			.fn()
			.mockResolvedValue(mockBlogPostSuccessResponse);

		jest.useFakeTimers();
		jest.setSystemTime(new Date("2024-04-08"));
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
		getStoryblokApi().get = jest
			.fn()
			.mockRejectedValue(JSON.stringify(Mock404FromStoryblokApi));
		jest.mock("@/utils/storyblok", () => ({
			getSlugFromParams: jest.fn().mockReturnValueOnce("slug-does-not-exist"),
			getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
			fetchStory: jest.fn().mockRejectedValue({ notFound: true }),
		}));
		const context = {
			query: {},
			params: { slug: "slug-does-not-exist" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>;

		const result = await getServerSideProps(context);

		expect(result).toEqual({ notFound: true });
	});

	it("should return error if fetchStory returns error", async () => {
		const mockErrorMessage =
			"There was an error fetching this story. Please try again later.";
		const mockCatchError = new Error(mockErrorMessage);

		fetchStorySpy.mockRejectedValueOnce(mockCatchError);

		const result = await getServerSideProps({
			query: {},
			params: { slug: "test-slug" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

		expect(result).toEqual({ props: { error: mockErrorMessage } });
	});

	it("should return a general error message if there is a throw that is not an Error object", async () => {
		const mockCatchError = "some string error";

		fetchStorySpy.mockRejectedValueOnce(mockCatchError);

		const result = await getServerSideProps({
			query: {},
			params: { slug: "test-slug" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

		expect(result).toEqual({
			props: {
				error:
					"Oops! Something went wrong and we're working to fix it. Please try again later.",
			},
		});
	});

	it("should fetch story and return it with breadcrumbs when slug is provided", async () => {
		const context = {
			query: { version: "published" },
			params: { slug: "test-slug" },
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
				...mockBlogPostSuccessResponse.data,
			},
		});
	});
});
