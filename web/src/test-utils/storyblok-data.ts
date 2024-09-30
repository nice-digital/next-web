// Dump any useful test objects in here for mocking Storyblok responses

import { type StoryblokStory } from "storyblok-generate-ts";

import {
	type AuthorStoryblok,
	type RichtextStoryblok,
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
	AssetStoryblok,
	PodcastStoryblok,
	InDepthArticleStoryblok,
} from "@/types/storyblok";

export const mockStoryblokStory = {
	id: 123456789,
	uuid: "abc123",
	name: "Title of the story",
	created_at: "1980-08-27T11:12:13.194Z",
	published_at: "2024-01-31T15:16:15.194Z",
	first_published_at: "2024-01-30T15:16:15.194Z",
	slug: "i-am-a-slug",
	full_slug: "i/am/a-very-full-slug",
	sort_by_date: null,
	position: 3,
	tag_list: ["rhubarb", "custard"],
	is_startpage: false,
	parent_id: 987654321,
	meta_data: null,
	group_id: "5625b207-7bb8-4410-aac3-3d7d5743f97a",
	release_id: null,
	lang: "default",
	path: undefined,
	alternates: [],
	default_full_slug: "default-full-slug",
	translated_slugs: [
		{
			path: "/translated-slug-path",
			name: "Translated slug name",
			lang: "en",
		},
	],
};

export const mockAuthorBlok: StoryblokStory<AuthorStoryblok> = {
	...mockStoryblokStory,
	name: "Test Author title",
	content: {
		component: "author",
		name: "Bob Holness",
		jobTitle: "Blockbusters host",
		image: {
			id: 123,
			filename:
				"http://local-host-test-nice-org.com/f/243782/420x234/7a576133e7/register-for-board-meeting.PNG/m/867x0/filters:format%28jpeg%29:quality%2880%29",
			name: "Bob",
			alt: "Bob the host",
		},
		_uid: "123",
	},
};

export const mockRichText: RichtextStoryblok = {
	type: "doc",
	content: [
		{
			type: "heading",
			attrs: {
				level: 2,
			},
			content: [
				{
					text: "A mock h2 heading in a rich text field",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 3,
			},
			content: [
				{
					text: "A mock h3 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 4,
			},
			content: [
				{
					text: "A mock h4 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 5,
			},
			content: [
				{
					text: "A mock h5 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 6,
			},
			content: [
				{
					text: "A mock h6 heading",
					type: "text",
				},
			],
		},
		{
			type: "paragraph",
			content: [
				{
					type: "text",
					text: "Example text content.",
				},
			],
		},
		{
			type: "paragraph",
			content: [
				{
					type: "image",
					attrs: {
						id: "13894387",
						alt: "Kitten wearing mittens",
						src: "http://local-host-test-nice-org.com/f/243782/420x234/7a576133e7/register-for-board-meeting.PNG/m/867x0/filters:format%28jpeg%29:quality%2880%29",
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
	],
};

export const mockNewsArticle: StoryblokStory<NewsArticleStoryblok> = {
	...mockStoryblokStory,
	id: 987654,
	name: "Test news article title",
	content: {
		title: "Test news article title",
		date: "2024-01-31T15:16:15.19",
		introText: "Test intro text",
		image: {
			id: 123,
			filename:
				"http://local-host-test-nice-org.com/f/243782/420x234/7a576133e7/register-for-board-meeting.PNG/m/867x0/filters:format%28jpeg%29:quality%2880%29",
			name: "A kitten being a kitten",
			alt: "Kitten mittens",
		},
		_uid: "abc123",
		component: "newsArticle",
		content: { ...mockRichText },
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
	},
};

export const mockBlogPost: StoryblokStory<BlogPostStoryblok> = {
	...mockStoryblokStory,
	name: "Test blog post title",
	content: {
		title: "Test blog post title",
		date: "2024-02-20",
		introText: "Let's play Blockbusters!",
		author: [{ ...mockAuthorBlok }],
		image: {
			id: 456,
			filename:
				"http://local-host-test-nice-org.com/f/243782/420x234/7a576133e7/register-for-board-meeting.PNG/m/867x0/filters:format%28jpeg%29:quality%2880%29",
			name: "Cat cat cat",
			alt: "A kitty cat",
		},
		_uid: "def456",
		component: "blogPost",
		content: { ...mockRichText },
	},
};

export const mockPodcastPage: StoryblokStory<PodcastStoryblok> = {
	...mockStoryblokStory,
	name: "Test podcast title",
	content: {
		_uid: "2663bc46-cefe-4878-8c86-ecc78cc1f65e",
		date: "2024-04-17 12:00",
		image: {
			id: 15267557,
			alt: "",
			name: "",
			focus: "",
			title: "",
			source: "",
			filename:
				"https://local-host-test-nice-org.com/f/243782/413x297/6a7748fdb4/stroke.PNG",
			copyright: "",
			fieldtype: "asset",
			meta_data: {},
			is_private: false,
			is_external_url: false,
		},
		component: "podcast",
		introText:
			"It is estimated that there are around 85,000 strokes every year in England, with over 1 million people currently living with its long-term effects.\n" +
			"\n" +
			"We catch up with Jon Brown, chair of the independent committee and Professor Stephen Hill, lay member on the committee about NICE’s updated guidance on stroke rehabilitation.",
		description: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "It is estimated that there are around 85,000 strokes every year in England, with over 1 million people currently living with its long-term effects.",
							type: "text",
						},
					],
				},
			],
		},
		soundcloudEmbedID: "1648857267",
	},
};

export const mockImageAsset: AssetStoryblok = {
	filename:
		"http://local-host-test-nice-org.com/f/243782/420x234/7a576133e7/register-for-board-meeting.PNG/m/867x0/filters:format%28jpeg%29:quality%2880%29",
	id: 654654654,
	name: "Delicious bacon",
};

export const mockIndepthArticle: StoryblokStory<InDepthArticleStoryblok> = {
	...mockStoryblokStory,
	name: "sample indepth test",
	id: 476215653,
	uuid: "7bb356cb",
	content: {
		_uid: "cd984458-0e14-4fd6-871d-469e9cd3a845",
		date: "2024-04-10 12:00",
		link: {
			id: "",
			url: "https://local-host-test-nice-org.com/news/blogs/lessons-learned-from-the-multi-agency-advisory-service",
			linktype: "url",
			fieldtype: "multilink",
			cached_url:
				"https://local-host-test-nice-org.com/news/blogs/lessons-learned-from-the-multi-agency-advisory-service",
		},
		image: mockImageAsset,
		title: "sample test",
		component: "inDepthArticle",
		introText:
			"Clíodhna Ní Ghuidhir and Rebecca Boffa outline the common challenges that developers of artificial intelligence (AI) tech face when navigating their way to the health and care market, and link to their series of articles, which provide further advice on what can be done to avoid these.",
	},
};
