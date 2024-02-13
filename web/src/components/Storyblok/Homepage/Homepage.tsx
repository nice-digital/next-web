import { StoryblokComponent } from "@storyblok/react";
import { type StoryblokStory } from "storyblok-generate-ts";

import { type NewsStory } from "@/types/News";
import {
	type HomepageStoryblok,
	type BlogPostStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

import { HomepageLatestNews } from "./HomepageLatestNews/HomepageLatestNews";

interface HomepageBlokProps {
	blok: HomepageStoryblok;
	latestNews: (
		| StoryblokStory<BlogPostStoryblok>
		| StoryblokStory<NewsArticleStoryblok>
	)[];
}

export const Homepage = ({
	blok,
	latestNews,
}: HomepageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.hero.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
			<HomepageLatestNews
				featuredStory={blok.featuredStory as NewsStory}
				latestNews={latestNews}
			/>
			{blok.primaryActionBanner &&
				blok.primaryActionBanner.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
		</>
	);
};
