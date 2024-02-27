import { render, screen } from "@testing-library/react";

import { mockNewsArticle } from "@/test-utils/storyblok-data";
import {
	RelatedLinkStoryblok,
	RelatedNewsLinkStoryblok,
} from "@/types/storyblok";

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
			title: "News",
			path: "/news",
		},
		{
			title: "News articles",
			path: "/news/articles",
		},
	],
};

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: ({
		blok,
	}: {
		blok: RelatedLinkStoryblok | RelatedNewsLinkStoryblok;
	}) => {
		return <div data-testid={`mock-${blok.component}`}>{blok.title}</div>;
	},
}));

describe("NewsArticle", () => {
	it("renders the news article", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByText(mockNewsArticle.content.title)).toBeInTheDocument();
		expect(
			screen.getByText(mockNewsArticle.content.introText)
		).toBeInTheDocument();
		expect(
			screen.getByText("This is a mock news article paragraph")
		).toBeInTheDocument();
	});

	it("renders the news article with an image", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByRole("img")).toBeInTheDocument();
		expect(screen.getByAltText("Kitten mittens")).toBeInTheDocument();
	});

	it("renders the news article with related links", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByTestId("mock-relatedLink")).toBeInTheDocument();
	});

	it("renders the news article with related news links", () => {
		render(<StoryblokNewsArticle blok={newsArticleProps.blok} />);
		expect(screen.getByTestId("mock-relatedNewsLink")).toBeInTheDocument();

		//TODO: sanity check in mob session
		if (mockNewsArticle.content && mockNewsArticle.content.relatedNews) {
			const relatedNewsTitle = mockNewsArticle.content?.relatedNews[0].title;
			expect(screen.getByText(relatedNewsTitle)).toBeInTheDocument();
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
