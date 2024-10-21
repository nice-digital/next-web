import { ISbStoryData } from "@storyblok/react";

import { NewsCard } from "@/components/Storyblok/News/NewsCard/NewsCard";
import { NewsStory } from "@/types/News";

import styles from "./NewsList.module.scss";

interface NewsListProps {
	news: ISbStoryData<NewsStory>[];
	showImage?: boolean;
}

export const NewsList: React.FC<NewsListProps> = ({
	news,
	showImage,
}: NewsListProps) => (
	<ul className={styles.newsList}>
		{news.map((story) => {
			return (
				<li className={styles.newsItem} key={story.id}>
					<NewsCard
						story={story}
						variant="isNewsListItem"
						showImage={showImage}
					/>
				</li>
			);
		})}
	</ul>
);
