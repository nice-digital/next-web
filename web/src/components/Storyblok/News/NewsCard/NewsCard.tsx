import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { NewsStory } from "@/types/News";
import {
	friendlyDate,
	getNewsType,
	defaultPodcastImage,
} from "@/utils/storyblok";

import styles from "./NewsCard.module.scss";

interface NewsCardProps {
	story: StoryblokStory<NewsStory>;
	headingLevel?: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({
	story,
	headingLevel = 3,
}: NewsCardProps) => {
	const { name, content, full_slug } = story;

	const storyType = getNewsType(content.component);

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Fall back to podcast placeholder image if none is supplied
	const image = content.image?.filename || defaultPodcastImage;

	return (
		<article className={styles.newsCard}>
			<Link
				className={styles.imageContainer}
				href={full_slug}
				style={{ backgroundImage: `url(${image})` }}
				aria-hidden="true"
				tabindex="-1"
			>
				{" "}
			</Link>
			<HeadingElement className={styles.heading}>
				<Link href={full_slug}>{name}</Link>
			</HeadingElement>
			<p>{content.introText}</p>
			<footer>
				<Tag outline>{storyType}</Tag>
				<span className={styles.date}>{friendlyDate(story.content.date)}</span>
			</footer>
		</article>
	);
};
