import Link from "next/link";

import { Tag } from "@nice-digital/nds-tag";

import { type NewsStory } from "@/types/News";
import { friendlyDate } from "@/utils/storyblok";

import styles from "./FeaturedStory.module.scss";

interface FeaturedStoryProps {
	story: NewsStory;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
	story,
}: FeaturedStoryProps) => {
	const storyType = story.content.component === "blogPost" ? "Blog" : "News";

	return (
		<div className={styles.story}>
			<div className={styles.imageContainer}>
				<img src={story.content.image.filename} alt={story.content.image.alt} />
			</div>
			<h3 className={styles.heading}>
				<Link href={`/${story.full_slug}`}>{story.name}</Link>
			</h3>
			<p>{story.content.introText}</p>
			<p>{friendlyDate(story.content.date)}</p>
			<Tag outline>{storyType}</Tag>
		</div>
	);
};
