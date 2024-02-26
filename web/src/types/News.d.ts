import { type StoryblokStory } from "storyblok-generate-ts";
import { type BlogPostStoryblok, type NewsArticleStoryblok } from "./storyblok";

export type NewsStory =
	| StoryblokStory<BlogPostStoryblok>
	| StoryblokStory<NewsArticleStoryblok>;
