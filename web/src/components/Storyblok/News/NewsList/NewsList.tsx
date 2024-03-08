import { StoryblokStory } from "storyblok-generate-ts";

import { NewsCard } from "@/components/Storyblok/News/NewsCard/NewsCard";
import { NewsStory } from "@/types/News";

import styles from "./NewsList.module.scss";

interface NewsListProps {
	news: StoryblokStory<NewsStory>[];
}

export const NewsList: React.FC<NewsListProps> = ({ news }: NewsListProps) => (
	<ul className={styles.newsList}>
		{news.map((story) => {
			return (
				<li className={styles.newsItem} key={story.id}>
					<NewsCard story={story} variant="isNewsListItem" />
				</li>
			);
		})}
	</ul>
);
