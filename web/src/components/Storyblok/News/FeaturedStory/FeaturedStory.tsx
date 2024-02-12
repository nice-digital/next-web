import Link from "next/link";

import { type NewsStory } from "@/types/News";
import { friendlyDate } from "@/utils/storyblok";

import styles from "./FeaturedStory.module.scss";

interface FeaturedStoryProps {
	story: NewsStory;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
	story,
}: FeaturedStoryProps) => {
	console.log("Featured story:", story);

	const storyType = story.content.component === "blogPost" ? "Blog" : "News";

	return (
		<div className={styles.story}>
			<h3>
				{storyType}: <Link href={`/${story.full_slug}`}>{story.name}</Link>
			</h3>
			<p>{story.content.introText}</p>
			<p>{friendlyDate(story.content.date)}</p>
			<img src={story.content.image.filename} alt={story.content.image.alt} />
		</div>
	);
};
