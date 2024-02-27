// Dump any useful test objects in here for mocking Storyblok responses

import { type StoryblokStory } from "storyblok-generate-ts";

import {
	AuthorStoryblok,
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

const mockStoryblokStory = {
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
			filename: "https://placekitten.com/200/139",
			name: "Bob",
			alt: "Bob the host",
		},
		_uid: "123",
	},
};

export const mockNewsArticle: StoryblokStory<NewsArticleStoryblok> = {
	...mockStoryblokStory,
	name: "Test news article title",
	content: {
		title: "Test news article title",
		date: "2024-01-31T15:16:15.194Z",
		introText: "Test intro text",
		author: "Noel Edmonds",
		image: {
			id: 123,
			filename: "https://placekitten.com/200/286",
			name: "A kitten being a kitten",
			alt: "Kitten mittens",
		},
		_uid: "abc123",
		component: "newsArticle",
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "This is a mock news article paragraph",
							type: "text",
						},
					],
				},
			],
		},
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
			filename: "https://placekitten.com/200/139",
			name: "Cat cat cat",
			alt: "A kitty cat",
		},
		_uid: "def456",
		component: "blogPost",
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "This is a mock blog post paragraph",
							type: "text",
						},
					],
				},
			],
		},
	},
};