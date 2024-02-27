// Dump any useful test objects in here for mocking Storyblok responses

import { type StoryblokStory } from "storyblok-generate-ts";

import {
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
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
		},
		_uid: "abc123",
		component: "newsArticle",
		content: {
			type: "something",
		},
	},
};

export const mockBlogPost: StoryblokStory<BlogPostStoryblok> = {
	...mockStoryblokStory,
	name: "Test blog post title",
	content: {
		title: "Test blog post title",
		date: "2024-02-20",
		introText: "Let's play Blockbusters!",
		author: ["Bob Holness"],
		image: {
			id: 456,
			filename: "https://placekitten.com/200/139",
			name: "Cat cat cat",
		},
		_uid: "def456",
		component: "blogPost",
		content: {
			type: "something",
		},
	},
};
