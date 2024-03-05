import { ParsedUrlQuery } from "querystring";

import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import { NewsStory } from "@/types/News";

import { ArticlesIndexPage, NewsArticlesProps } from "./index.page";
import mockStory from "./mockStory.json";

jest.mock("@storyblok/react", () => ({
	getStoryblokApi: jest.fn(),
}));

jest.mock("@/utils/storyblok", () => ({
	friendlyDate: jest.fn().mockReturnValue("10 January 2024"),
}));

describe("/news/articles/index.page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			route: "/news/articles",
			pathname: "/news/articles",
			query: { page: "1" },
			asPath: "/news/articles",
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
			push: jest.fn(),
		});
	});

	afterEach(() => jest.clearAllMocks());

	const generateStory = (
		id: number,
		name: string,
		date: string,
		component = "newsArticle"
	) => ({
		...mockStory,
		name,
		id,
		content: {
			...mockStory.content,
			date,
			component,
		},
	});

	const mockStories = Array.from({ length: 8 }, (_, i) =>
		generateStory(i + 1, `Test story ${i + 1}`, `2023-0${i + 1}-10`)
	);

	const mockFeaturedStory = generateStory(0, "Featured story", "2024-01-10");

	const resultsPerPage = 6;
	const totalResults = 8;
	const currentPage = 1;
	const mockProps: NewsArticlesProps = {
		stories: mockStories.slice(
			0,
			resultsPerPage
		) as unknown as StoryblokStory<NewsStory>[],
		currentPage,
		totalResults,
		resultsPerPage,
		featuredStory: mockFeaturedStory as unknown as StoryblokStory<NewsStory>,
	};

	it("should match snapshot for main content", () => {
		render(<ArticlesIndexPage {...mockProps} />);
		expect(document.body).toMatchSnapshot();
	});

	it("should render a featured story if the page is 1 and there is a featured story", () => {
		render(<ArticlesIndexPage {...mockProps} />);
		expect(screen.getByText("Featured story")).toBeInTheDocument();
	});

	describe("getServerSideProps", () => {
		it("should redirect to /news/articles if the page is less than 1", async () => {
			const { getServerSideProps } = await import("./index.page");
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
				fetchStories: jest.fn().mockResolvedValue({
					stories: mockStories,
					total: totalResults,
				}),
			}));

			const result = await getServerSideProps({
				query: { page: "-1" },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				redirect: {
					destination: "/news/articles",
					permanent: false,
				},
			});
		});

		it("should redirect to /news/articles if the page is greater than the total number of pages", async () => {
			const { getServerSideProps } = await import("./index.page");
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
				fetchStories: jest.fn().mockResolvedValue({
					stories: mockStories,
					total: totalResults,
				}),
			}));

			const result = await getServerSideProps({
				query: { page: "3" },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result).toEqual({
				redirect: {
					destination: "/news/articles",
					permanent: false,
				},
			});
		});

		it("should set featuredStory to null if the page is greater than 1", async () => {
			const { getServerSideProps } = await import("./index.page");
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
				fetchStories: jest.fn().mockResolvedValue({
					stories: mockStories,
					total: totalResults,
				}),
			}));

			const result = await getServerSideProps({
				query: { page: "2" },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result.props?.featuredStory).toBeNull();
		});

		it("should set the latest story as the featured story if the page is 1", async () => {
			const { getServerSideProps } = await import("./index.page");
			jest.mock("@/utils/storyblok", () => ({
				getStoryVersionFromQuery: jest.fn().mockReturnValue("published"),
				fetchStories: jest.fn().mockResolvedValue({
					stories: mockStories,
					total: totalResults,
				}),
			}));

			const result = await getServerSideProps({
				query: { page: "1" },
			} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

			expect(result.props?.featuredStory).toEqual(mockStories[0]);
		});
	});
});
