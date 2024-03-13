/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedUrlQuery } from "querystring";

import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { mockNewsArticle as mockStory } from "@/test-utils/storyblok-data";

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

const mockNullFeaturedStoryResponse = {
	featuredStory: null,
	stories: [],
	total: 0,
	currentPage: 2,
	perPage: undefined,
};
const mockSuccessResponse = {
	featuredStory: mockFeaturedStory,
	stories: mockStories,
	total: 8,
	currentPage: 2,
	perPage: 4,
};

jest.mock("@storyblok/react", () => ({
	getStoryblokApi: jest.fn(),
}));

describe("getServerSideProps", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			route: "/news/articles",
			pathname: "/news/articles",
			query: { page: "2" },
			asPath: "/news/articles?page=2",
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
			push: jest.fn(),
		});
	});

	it("should set featuredStory to null if the page is greater than 1", async () => {
		jest.mock("@/utils/storyblok", () => ({
			validateRouteParams: jest.fn(() => {
				return Promise.resolve(mockNullFeaturedStoryResponse);
			}),
		}));

		const { getServerSideProps } = await import("./index.page");
		const result = await getServerSideProps({
			query: { page: "2" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

		expect(
			result && "props" in result && result.props.featuredStory
		).toBeNull();
	});

	it("should set featuredStory to mockFeaturedStory if the page is 1", async () => {
		jest.mock("@/utils/storyblok", () => ({
			validateRouteParams: jest.fn(() => {
				return Promise.resolve(mockSuccessResponse);
			}),
		}));

		const { getServerSideProps } = await import("./index.page");
		const result = await getServerSideProps({
			query: { page: "1" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

		expect(result && "props" in result && result.props.featuredStory).toEqual(
			mockFeaturedStory
		);
	});
});
