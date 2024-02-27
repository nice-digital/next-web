import { NewsCard } from "@/components/Storyblok/News/NewsCard/NewsCard";
import { NewsStory } from "@/types/News";

import styles from "./NewsList.module.scss";

interface NewsListProps {
	news: NewsStory[];
}

export const NewsList: React.FC<NewsListProps> = ({ news }: NewsListProps) => (
	<ul className={styles.NewsList}>
		{/* className={`${styles.newsCard} ${isListItem ? styles.listItem : ''}` */}

		{news.map((story) => {
			return (
				<li className={styles.newsItem} key={story.id}>
					<NewsCard story={story} />
				</li>
			);
		})}
	</ul>
);
