import {
	type PodcastStoryblok,
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
	type InDepthArticleStoryblok,
} from "./storyblok";

export type NewsStory =
	| BlogPostStoryblok
	| NewsArticleStoryblok
	| PodcastStoryblok
	| InDepthArticleStoryblok;
