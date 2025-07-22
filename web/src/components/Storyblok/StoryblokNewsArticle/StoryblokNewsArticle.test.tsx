import { render, screen } from "@testing-library/react";

import { mockNewsArticle } from "@/test-utils/storyblok-data";

import {
	StoryblokNewsArticle,
	StoryblokNewsArticleProps,
} from "./StoryblokNewsArticle";

const { content } = mockNewsArticle;
const newsArticleProps: StoryblokNewsArticleProps = {
	blok: {
		...content,
	},
	breadcrumbs: [
		{
			title: "Home",
			path: "/",
		},
		{
			title: "News",
			path: "/news",
		},
		{
			title: "News articles",
			path: "/news/articles",
		},
	],
};

describe("NewsArticle", () => {
	it("renders the news article", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByText(mockNewsArticle.content.title)).toBeInTheDocument();
		expect(
			screen.getByText(mockNewsArticle.content.introText)
		).toBeInTheDocument();
		expect(
			screen.getByText("A mock h2 heading in a rich text field")
		).toBeInTheDocument();
	});

	it("renders the news article with an image", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByAltText("Kitten mittens")).toBeInTheDocument();
	});

	it("renders the news article with related links", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(
			screen.getByTestId("storyblok-component-relatedLink")
		).toBeInTheDocument();
	});

	it("renders the news article with related news links", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(
			screen.getByTestId("storyblok-component-relatedNewsLink")
		).toBeInTheDocument();

		if (mockNewsArticle.content && mockNewsArticle.content.relatedNews) {
			const relatedNewsTitle = mockNewsArticle.content?.relatedNews[0].title;
			expect(
				screen.getByText(relatedNewsTitle, { exact: false })
			).toBeInTheDocument();
		}
	});

	it("should render the signup action panel", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(
			screen.getByText("Sign up for newsletters and alerts")
		).toBeInTheDocument();
	});

	it("should render the breadcrumbs", () => {
		render(
			<StoryblokNewsArticle
				blok={newsArticleProps.blok}
				breadcrumbs={newsArticleProps.breadcrumbs}
			/>
		);
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "News" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "News articles" })
		).toBeInTheDocument();
	});

	it("should render the page meta", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByTestId("pageTag")).toBeInTheDocument();
		expect(screen.getByText("News")).toBeInTheDocument();
		expect(screen.getByText("31 January 2024")).toBeInTheDocument();
	});
});
