import Link from "next/link";
import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { type NewsStory } from "@/types/News";
import { friendlyDate } from "@/utils/storyblok";

import styles from "./FeaturedStory.module.scss";

interface FeaturedStoryProps {
	story: StoryblokStory<NewsStory>;
	headingLevel?: number;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
	story,
	headingLevel = 3,
}: FeaturedStoryProps) => {
	const storyType = story.content.component === "blogPost" ? "Blog" : "News";

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	return (
		<article className={styles.story}>
			<div
				className={styles.imageContainer}
				style={{ backgroundImage: `url(${story.content.image.filename})` }}
			></div>
			<div className={styles.content}>
				<HeadingElement className={styles.heading}>
					<Link href={`/${story.full_slug}`}>{story.name}</Link>
				</HeadingElement>
				<p>{story.content.introText}</p>
				<footer>
					<Tag outline>{storyType}</Tag>
					<span className={styles.date}>
						{friendlyDate(story.content.date)}
					</span>
				</footer>
			</div>
		</article>
	);
};