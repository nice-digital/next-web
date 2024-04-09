import { StoryblokStory } from "storyblok-generate-ts";

import { NewsCard } from "@/components/Storyblok/News/NewsCard/NewsCard";
import { NewsStory } from "@/types/News";

import styles from "./NewsGrid.module.scss";

interface NewsGridProps {
	news: StoryblokStory<NewsStory>[];
}

export const NewsGrid: React.FC<NewsGridProps> = ({ news }: NewsGridProps) => (
	<ol className={styles.newsGrid}>
		{news.map((story) => {
			return (
				<li className="newsItem" key={story.id}>
					<NewsCard story={story} />
				</li>
			);
		})}
	</ol>
);
