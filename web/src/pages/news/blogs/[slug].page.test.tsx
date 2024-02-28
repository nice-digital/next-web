import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { mockBlogPost } from "@/test-utils/storyblok-data";
import { BlogPostStoryblok } from "@/types/storyblok";
import {
	getSlugFromParams,
	fetchStory,
	getStoryVersionFromQuery,
	SBSingleResponse,
} from "@/utils/storyblok"; // replace with actual path

import BlogPostPage, { getServerSideProps } from "./[slug].page";

jest.mock("@/utils/storyblok", () => jest.fn()); // replace with actual path

const mockBreadcrumbs = [
	{ title: "News", path: "/news" },
	{ title: "Blogs", path: "/news/blogs" },
];

jest.mock("@/utils/storyblok", () => ({
	fetchStory: jest.fn(),
	getStoryVersionFromQuery: jest.fn(),
	getSlugFromParams: jest.fn(),
	getAdditionalMetaTags: jest.fn(),
	getBreadcrumbs: jest.fn(),
}));

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: ({ blok }: { blok: BlogPostStoryblok }) => {
		return <div data-testid={`mock-${blok.component}`}>{blok.title}</div>;
	},
}));

describe("BlogPostPage", () => {
	it("renders the page", () => {
		render(<BlogPostPage story={mockBlogPost} />);
		expect(screen.getByText(mockBlogPost.content.title)).toBeInTheDocument();
	});
});

describe("getServerSideProps", () => {
	it("should return notFound when slug is not provided", async () => {
		const context = {
			query: {},
			params: {},
		} as GetServerSidePropsContext;

		const result = await getServerSideProps(context);

		expect(result).toEqual({ notFound: true });
	});

	it("should fetch story and return it with breadcrumbs when slug is provided", async () => {
		const context = {
			query: { version: "published" },
			params: { slug: "test-slug" },
		} as unknown as GetServerSidePropsContext;

		(getSlugFromParams as jest.Mock).mockReturnValueOnce("mock-blog-post");
		(getStoryVersionFromQuery as jest.Mock).mockReturnValueOnce("published");
		(fetchStory as jest.Mock).mockResolvedValue(
			mockBlogPost as SBSingleResponse<BlogPostStoryblok>
		);

		const result = await getServerSideProps(context);

		expect(fetchStory).toHaveBeenCalledWith(
			"news/blogs/mock-blog-post",
			"published",
			{
				resolve_relations: "blogPost.author",
			}
		);

		expect(result).toEqual({
			props: {
				...mockBlogPost,
				breadcrumbs: mockBreadcrumbs,
			},
		});
	});
});
