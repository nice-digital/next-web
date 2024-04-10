import { StoryblokStory } from "storyblok-generate-ts";

import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsGrid } from "@/components/Storyblok/News/NewsGrid/NewsGrid";
import { type NewsStory } from "@/types/News";

import styles from "./HomepageLatestNews.module.scss";

interface LatestNewsProps {
	featuredStory?: StoryblokStory<NewsStory>;
	latestNews: StoryblokStory<NewsStory>[];
}

export const HomepageLatestNews: React.FC<LatestNewsProps> = ({
	featuredStory,
	latestNews,
}: LatestNewsProps) => {
	return (
		<section className={styles.latestNews} data-tracking="latest-news">
			<h2 className={styles.title}>Latest from NICE</h2>
			{featuredStory && <FeaturedStory story={featuredStory} />}
			<NewsGrid news={latestNews} />
		</section>
	);
};
