import { type StoryblokStory } from "storyblok-generate-ts";

import {
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

interface LatestNewsProps {
	featuredStory?:
		| string
		| StoryblokStory<BlogPostStoryblok>
		| StoryblokStory<NewsArticleStoryblok>;
	latestNews: (
		| StoryblokStory<BlogPostStoryblok>
		| StoryblokStory<NewsArticleStoryblok>
	)[];
}

export const HomepageLatestNews: React.FC<LatestNewsProps> = ({
	featuredStory,
	latestNews,
}: LatestNewsProps) => {
	console.log("Latest news in the component:", latestNews);

	return (
		<>
			{featuredStory && "Got a featured story!"}
			<p>Latest news has {latestNews.length} items!</p>
		</>
	);
};
