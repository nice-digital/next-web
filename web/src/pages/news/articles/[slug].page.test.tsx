import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { mockNewsArticle } from "@/test-utils/storyblok-data";
import * as storyblokUtils from "@/utils/storyblok";

import NewsArticlePage, { getServerSideProps } from "./[slug].page";

const mockArticle = {
	...mockNewsArticle,
};

describe("NewsArticlePage", () => {
	it("renders the page", () => {
		render(<NewsArticlePage story={mockNewsArticle} />);
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
		beforeEach(() => {
			fetchStorySpy = jest.spyOn(storyblokUtils, "fetchStory");
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
			fetchStorySpy.mockResolvedValue({ notFound: true });
			const context = {
				query: {},
				params: { slug: "slug-does-not-exist" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ notFound: true });
		});

		it("should return an error if fetchStory returns an error", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(new Error(errorMessage));
			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({ props: { error: errorMessage } });
		});

		//TODO: should we be returning a generic error message in any case?
		it("should return a generic error message if fetchStory returns an error without a message", async () => {
			const errorMessage = "An error occurred";
			fetchStorySpy.mockRejectedValue(errorMessage);

			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);
			expect(result).toEqual({
				props: {
					error:
						"Oops! Something went wrong and we're working to fix it. Please try again later.",
				},
			});
		});

		it("should return the story and breadcrumbs", async () => {
			fetchStorySpy.mockResolvedValue({ story: mockArticle });
			const context = {
				query: {},
				params: { slug: "test-slug" },
			} as unknown as GetServerSidePropsContext;

			const result = await getServerSideProps(context);

			expect(result).toEqual({
				props: {
					story: mockArticle,
					breadcrumbs: [
						{ title: "News", path: "/news" },
						{ title: "News articles", path: "/news/articles" },
					],
				},
			});
		});
	});
});
