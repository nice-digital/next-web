import { ISbStoryData } from "@storyblok/react";

import { Link } from "@/components/Link/Link";
import { FeaturedStory } from "@/components/Storyblok/News/FeaturedStory/FeaturedStory";
import { NewsGrid } from "@/components/Storyblok/News/NewsGrid/NewsGrid";
import { type NewsStory } from "@/types/News";

import styles from "./HomepageLatestNews.module.scss";

interface LatestNewsProps {
	featuredStory?: ISbStoryData<NewsStory>;
	latestNews: ISbStoryData<NewsStory>[];
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
			<p>
				<Link href="/news/">View all news, blogs and podcasts</Link>
			</p>
		</section>
	);
};
