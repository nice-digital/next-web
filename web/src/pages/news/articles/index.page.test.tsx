import { ParsedUrlQuery } from "querystring";

import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { StoryblokStory } from "storyblok-generate-ts";

import { mockNewsArticle as mockStory } from "@/test-utils/storyblok-data";
import { NewsStory } from "@/types/News";

import { ArticlesIndexPage, NewsArticlesProps } from "./index.page";

jest.mock("@/utils/storyblok", () => ({
	...jest.requireActual("@/utils/storyblok"),
	initStoryblok: jest.fn(),
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
		const { getServerSideProps } = await import("./index.page");
		const result = await getServerSideProps({
			query: { page: "2" },
		} as unknown as GetServerSidePropsContext<ParsedUrlQuery>);

		expect(result.props?.featuredStory).toBeNull();
	});
});
