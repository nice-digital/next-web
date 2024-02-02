import { render, screen } from "@testing-library/react";

import {
	NewsArticleStoryblok,
	RelatedLinkStoryblok,
	RelatedNewsLinkStoryblok,
} from "@/types/storyblok";

import { NewsArticle } from "./NewsArticle";

const newsArticleProps: NewsArticleStoryblok = {
	title: "Page title",
	introText: "Page summary",
	date: "2024-01-31",
	content: {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						text: "This is a mock news article",
						type: "text",
					},
				],
			},
		],
	},
	image: {
		id: 123,
		name: "Image",
		filename: "image.jpg",
		alt: "Image alt text",
	},
	_uid: "123",
	resources: [
		{
			_uid: "8f019cf9-3743-4126-94cb-092898b43636",
			link: {
				id: "e9c6fedf-5d63-4468-b29f-8884d5300ad8",
				url: "",
				linktype: "story",
				fieldtype: "multilink",
				cached_url: "test-new-nc-2",
			},
			title: "Test related link 1",
			component: "relatedLink",
			_editable:
				'<!--#storyblok#{"name": "relatedLink", "space": "271255", "uid": "8f019cf9-3743-4126-94cb-092898b43636", "id": "435600482"}-->',
		},
	],

	relatedNews: [
		{
			_uid: "50c7601a-1f1f-48f1-96e9-4f16f688fd7a",
			date: "2024-01-31 00:00",
			link: {
				id: "",
				url: "https://youtube.com/@niceorguk",
				linktype: "url",
				fieldtype: "multilink",
				cached_url: "https://youtube.com/@niceorguk",
			},
			title: "Test related news link 1",
			component: "relatedNewsLink",
			publisher: "NICE",
			_editable:
				'<!--#storyblok#{"name": "relatedNewsLink", "space": "271255", "uid": "50c7601a-1f1f-48f1-96e9-4f16f688fd7a", "id": "435600482"}-->',
		},
	],
	component: "newsArticle",
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
		render(<NewsArticle blok={newsArticleProps} />);
		expect(screen.getByText("Page title")).toBeInTheDocument();
		expect(screen.getByText("Page summary")).toBeInTheDocument();
		expect(screen.getByText("This is a mock news article")).toBeInTheDocument();
	});

	it("renders the news article with an image", () => {
		render(<NewsArticle blok={newsArticleProps} />);
		expect(screen.getByRole("img")).toBeInTheDocument();
		expect(screen.getByAltText("Image alt text")).toBeInTheDocument();
	});

	it("renders the news article with related links", () => {
		render(<NewsArticle blok={newsArticleProps} />);
		expect(screen.getByTestId("mock-relatedLink")).toBeInTheDocument();
		// expect(screen.getByText("Test related link 1")).toBeInTheDocument();
	});

	it("renders the news article with related news links", () => {
		render(<NewsArticle blok={newsArticleProps} />);
		expect(screen.getByTestId("mock-relatedNewsLink")).toBeInTheDocument();
		// expect(screen.getByText("Test related news link 1")).toBeInTheDocument();
	});
});
