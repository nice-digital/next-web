import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { mockNewsArticle } from "@/test-utils/storyblok-data";
import { NewsArticleStoryblok } from "@/types/storyblok";
import {
	fetchStory,
	getStoryVersionFromQuery,
	getSlugFromParams,
	getBreadcrumbs,
} from "@/utils/storyblok";

import NewsArticlePage, { getServerSideProps } from "./[slug].page";

const story = {
	name: "Mock News Article",
	created_at: "2024-01-31T14:47:27.503Z",
	published_at: "2024-01-31T15:16:15.194Z",
	id: 435600482,
	uuid: "ac5f62be-cec5-4cc0-847b-fad3d98c74c5",
	content: {
		_uid: "87f22048-51e6-46d4-80af-ceeeb3505550",
		date: "2024-01-31 00:00",
		image: {
			id: 13894387,
			alt: "doctor showing results on a tablet computer to a male patient",
			name: "",
			focus: "",
			title: "",
			source: "",
			filename:
				"https://a.storyblok.com/f/271255/788x443/b2d6d3a601/doctor-showing-results-on-tablet-computer-to-male-patient.jpg",
			copyright: "",
			fieldtype: "asset",
			meta_data: {},
			is_private: "",
			is_external_url: false,
		},
		title: "A mock news title",
		content: {
			type: "doc",
			content: [
				{
					type: "heading",
					attrs: { level: 2 },
					content: [
						{
							text: "A mock h2 heading in a news article rich text field",
							type: "text",
						},
					],
				},
				{
					type: "heading",
					attrs: { level: 3 },
					content: [{ text: "Test heading level 3", type: "text" }],
				},
				{
					type: "heading",
					attrs: { level: 4 },
					content: [{ text: "Test heading level 4", type: "text" }],
				},
				{
					type: "heading",
					attrs: { level: 5 },
					content: [{ text: "test heading level 5", type: "text" }],
				},
				{
					type: "heading",
					attrs: { level: 6 },
					content: [{ text: "test heading level 6", type: "text" }],
				},
				{
					type: "paragraph",
					content: [
						{
							text: "A mock paragraph in a news article rich text field.  Paragraph 1 will render some ",
							type: "text",
						},
						{ text: "bold text", type: "text", marks: [{ type: "bold" }] },
						{ text: ", some ", type: "text" },
						{
							text: "italic text, ",
							type: "text",
							marks: [{ type: "italic" }],
						},
						{ text: "some ", type: "text" },
						{
							text: "strike text",
							type: "text",
							marks: [{ type: "strike" }],
						},
						{ text: " ", type: "text", marks: [{ type: "italic" }] },
					],
				},
				{
					type: "paragraph",
					content: [
						{ text: "Another paragraph test. Paragraph 2", type: "text" },
					],
				},
				{
					type: "paragraph",
					content: [
						{
							type: "image",
							attrs: {
								id: 13894387,
								alt: "doctor showing results on a tablet computer to a male patient",
								src: "https://a.storyblok.com/f/271255/788x443/b2d6d3a601/doctor-showing-results-on-tablet-computer-to-male-patient.jpg",
								title: "",
								source: "",
								copyright: "",
								meta_data: {},
							},
						},
					],
				},
				{
					type: "blockquote",
					content: [
						{
							type: "paragraph",
							content: [
								{
									text: "A inline quote in the rich text field of a news article. ",
									type: "text",
								},
							],
						},
					],
				},
				{
					type: "bullet_list",
					content: [
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "unordered list item 1", type: "text" }],
								},
							],
						},
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "unordered list item 2", type: "text" }],
								},
							],
						},
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "unordered list item 3", type: "text" }],
								},
							],
						},
					],
				},
				{
					type: "ordered_list",
					attrs: { order: 1 },
					content: [
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "ordered list item 1", type: "text" }],
								},
							],
						},
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "unordered list item 2", type: "text" }],
								},
							],
						},
						{
							type: "list_item",
							content: [
								{
									type: "paragraph",
									content: [{ text: "unordered list item 3", type: "text" }],
								},
							],
						},
					],
				},
				{
					type: "blok",
					attrs: {
						id: "cfe043ae-da98-4e7c-afe7-136803cf9fb0",
						body: [
							{
								_uid: "i-997a361d-a00e-4386-8253-950fdc232264",
								source: "https://www.youtube.com/embed/Bs4zv6TwhYw",
								component: "youtubeEmbed",
								_editable:
									'\u003c!--#storyblok#{"name": "youtubeEmbed", "space": "271255", "uid": "i-997a361d-a00e-4386-8253-950fdc232264", "id": "435600482"}--\u003e',
							},
							{
								_uid: "i-a8c4105e-8431-4360-b325-280131aeaa11",
								component: "quote",
								quoteText: {
									type: "doc",
									content: [
										{
											type: "paragraph",
											content: [
												{
													text: "A test quote blok inserted into the rich text field in a news article",
													type: "text",
												},
											],
										},
									],
								},
								quoteAuthor: "Test Author",
								_editable:
									'\u003c!--#storyblok#{"name": "quote", "space": "271255", "uid": "i-a8c4105e-8431-4360-b325-280131aeaa11", "id": "435600482"}--\u003e',
							},
							{
								_uid: "i-a2d204bb-ad91-4d51-86dc-e683f5517cd2",
								cards: [
									{
										_uid: "e03727cc-60dd-47c9-a228-c48dc4b4e55d",
										body: "Test card body 1",
										link: {
											id: "3b2d47a3-2a78-4346-96c3-70072fdcab45",
											url: "",
											linktype: "story",
											fieldtype: "multilink",
											cached_url: "test-info-page-updated-hero",
										},
										heading: "Test card heading 1",
										component: "card",
										_editable:
											'\u003c!--#storyblok#{"name": "card", "space": "271255", "uid": "e03727cc-60dd-47c9-a228-c48dc4b4e55d", "id": "435600482"}--\u003e',
									},
									{
										_uid: "5c9c6fed-fb70-4c01-9212-df0ed5e4a266",
										body: "Test card body 2",
										link: {
											id: "f3a7c553-f1fb-465c-b1b2-db3385726f3c",
											url: "",
											linktype: "story",
											fieldtype: "multilink",
											cached_url:
												"news/articles/nice-recommends-new-treatment-for-rare-blood-disorder",
										},
										heading: "Test card heading 2",
										component: "card",
										_editable:
											'\u003c!--#storyblok#{"name": "card", "space": "271255", "uid": "5c9c6fed-fb70-4c01-9212-df0ed5e4a266", "id": "435600482"}--\u003e',
									},
									{
										_uid: "c2aab67b-4ea2-44bf-8432-8b65e9a1e8f4",
										body: "Test card body 3",
										link: {
											id: "",
											url: "https://www.youtube.com/@niceorguk",
											linktype: "url",
											fieldtype: "multilink",
											cached_url: "https://www.youtube.com/@niceorguk",
										},
										heading: "Test card heading 3",
										component: "card",
										_editable:
											'\u003c!--#storyblok#{"name": "card", "space": "271255", "uid": "c2aab67b-4ea2-44bf-8432-8b65e9a1e8f4", "id": "435600482"}--\u003e',
									},
								],
								columns: "3",
								component: "cardGrid",
								_editable:
									'\u003c!--#storyblok#{"name": "cardGrid", "space": "271255", "uid": "i-a2d204bb-ad91-4d51-86dc-e683f5517cd2", "id": "435600482"}--\u003e',
							},
						],
					},
				},
				{
					type: "paragraph",
					content: [
						{
							text: "Another paragraph following the allowed bloks. paragrph 3.  We'll follow this paragraph with some empty lines.  Empty lines will output empty paragraph tags in the markup unless we handle remove those empty p tags.",
							type: "text",
						},
					],
				},
				{ type: "heading", attrs: { level: 3 } },
				{ type: "paragraph" },
				{ type: "paragraph" },
				{ type: "paragraph" },
				{ type: "paragraph" },
			],
		},
		component: "newsArticle",
		introText: "Some mock intro text to be displayed in the page header",
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
					'\u003c!--#storyblok#{"name": "relatedLink", "space": "271255", "uid": "8f019cf9-3743-4126-94cb-092898b43636", "id": "435600482"}--\u003e',
			},
			{
				_uid: "94714547-6acc-4055-aa01-3cf899be9fc4",
				link: {
					id: "",
					url: "https://youtube.com/@niceorguk",
					linktype: "url",
					fieldtype: "multilink",
					cached_url: "https://youtube.com/@niceorguk",
				},
				title: "Test related link 2",
				component: "relatedLink",
				_editable:
					'\u003c!--#storyblok#{"name": "relatedLink", "space": "271255", "uid": "94714547-6acc-4055-aa01-3cf899be9fc4", "id": "435600482"}--\u003e',
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
					'\u003c!--#storyblok#{"name": "relatedNewsLink", "space": "271255", "uid": "50c7601a-1f1f-48f1-96e9-4f16f688fd7a", "id": "435600482"}--\u003e',
			},
			{
				_uid: "3cf9f2d3-cb7c-42e6-bf2e-ce72d7bc03ab",
				date: "2024-01-30 00:00",
				link: {
					id: "e9c6fedf-5d63-4468-b29f-8884d5300ad8",
					url: "",
					linktype: "story",
					fieldtype: "multilink",
					cached_url: "test-new-nc-2",
				},
				title: "Test related news link 2",
				component: "relatedNewsLink",
				publisher: "NICE-2",
				_editable:
					'\u003c!--#storyblok#{"name": "relatedNewsLink", "space": "271255", "uid": "3cf9f2d3-cb7c-42e6-bf2e-ce72d7bc03ab", "id": "435600482"}--\u003e',
			},
		],
		_editable:
			'\u003c!--#storyblok#{"name": "newsArticle", "space": "271255", "uid": "87f22048-51e6-46d4-80af-ceeeb3505550", "id": "435600482"}--\u003e',
	},
	slug: "mock-news-article",
	full_slug: "news/articles/mock-news-article",
	sort_by_date: null,
	position: -820,
	tag_list: [],
	is_startpage: false,
	parent_id: 428383157,
	meta_data: null,
	group_id: "5625b207-7bb8-4410-aac3-3d7d5743f97a",
	first_published_at: "2024-01-31T15:16:15.194Z",
	release_id: null,
	lang: "default",
	path: undefined,
	alternates: [],
	default_full_slug: undefined,
	translated_slugs: undefined,
};
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
		render(<NewsArticlePage story={mockArticle} />);
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
		const mockStory = { name: "Mock News Article", content: {} };

		jest.mocked(getSlugFromParams).mockReturnValue(slug);
		jest.mocked(getStoryVersionFromQuery).mockReturnValue(version);
		jest.mocked(fetchStory).mockResolvedValue(mockStory);

		const context = {
			params: { slug: [slug] },
			query: { version },
		} as unknown as GetServerSidePropsContext;

		const response = await getServerSideProps(context);
		expect(response).toEqual({
			props: {
				...mockStory,
				breadcrumbs: [
					{ title: "News", path: "/news" },
					{ title: "News articles", path: "/news/articles" },
				],
			},
		});
	});
});
