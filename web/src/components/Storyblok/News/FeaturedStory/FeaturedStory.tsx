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
			<div
				className={styles.imageContainer}
				style={{ backgroundImage: `url(${story.content.image.filename})` }}
			></div>
			<div className={styles.content}>
				<h3 className={styles.heading}>
					<Link href={`/${story.full_slug}`}>{story.name}</Link>
				</h3>
				<p>{story.content.introText}</p>
				<footer className={styles.footer}>
					<Tag outline>{storyType}</Tag>
					<span className={styles.date}>
						{friendlyDate(story.content.date)}
					</span>
				</footer>
			</div>
		</div>
	);
};
