import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { mockNewsArticle } from "@/test-utils/storyblok-data";
import { NewsArticleStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getBreadcrumbs,
	SBSingleResponse,
} from "@/utils/storyblok";

import NewsArticlePage, { getServerSideProps } from "./[slug].page";

const mockArticle = {
	...mockNewsArticle,
};

jest.mock("@/utils/storyblok", () => ({
	fetchStory: jest.fn(),
	getStoryVersionFromQuery: jest.fn(),
	getSlugFromParams: jest.fn(),
	getAdditionalMetaTags: jest.fn(),
	getBreadcrumbs: jest.fn(),
}));

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: ({ blok }: { blok: NewsArticleStoryblok }) => {
		return <div data-testid={`mock-${blok.component}`}>{blok.title}</div>;
	},
}));

describe("NewsArticlePage", () => {
	it("renders the page", () => {
		render(<NewsArticlePage story={mockNewsArticle} />);
		expect(screen.getByText(mockNewsArticle.content.title)).toBeInTheDocument();
	});
});

describe("getServerSideProps", () => {
	it("returns notFound if no slug is provided", async () => {
		const context = { query: {}, params: {} } as GetServerSidePropsContext;
		const result = await getServerSideProps(context);
		expect(result).toEqual({ notFound: true });
	});

	it("calls the fetchStory function when a slug is provided", async () => {
		const context = {
			query: { version: "draft" },
			params: { slug: "mock-news-article" },
		} as unknown as GetServerSidePropsContext;

		(getSlugFromParams as jest.Mock).mockReturnValueOnce("mock-news-article");
		(getStoryVersionFromQuery as jest.Mock).mockReturnValueOnce("draft");
		(fetchStory as jest.Mock).mockResolvedValueOnce([mockArticle.story, []]);
		(getBreadcrumbs as jest.Mock).mockResolvedValueOnce([]);
		await getServerSideProps(context);

		expect(fetchStory).toHaveBeenCalledWith(
			"news/articles/mock-news-article",
			"draft"
		);
	});

	it("returns the story and breadcrumbs", async () => {
		const slug = "test-slug";
		const version = "draft";

		jest.mocked(getSlugFromParams).mockReturnValue(slug);
		jest.mocked(getStoryVersionFromQuery).mockReturnValue(version);
		jest
			.mocked(fetchStory)
			.mockResolvedValue(
				mockNewsArticle as SBSingleResponse<NewsArticleStoryblok>
			);

		const context = {
			params: { slug: [slug] },
			query: { version },
		} as unknown as GetServerSidePropsContext;

		const response = await getServerSideProps(context);
		expect(response).toEqual({
			props: {
				...mockNewsArticle,
				breadcrumbs: [
					{ title: "News", path: "/news" },
					{ title: "News articles", path: "/news/articles" },
				],
			},
		});
	});
});
