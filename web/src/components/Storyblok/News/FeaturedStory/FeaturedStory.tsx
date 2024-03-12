import Link from "next/link";
import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { type NewsStory } from "@/types/News";
import {
	friendlyDate,
	getNewsType,
	defaultPodcastImage,
	newsTypes,
} from "@/utils/storyblok";

import styles from "./FeaturedStory.module.scss";

interface FeaturedStoryProps {
	story: StoryblokStory<NewsStory>;
	headingLevel?: number;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
	story,
	headingLevel = 3,
}: FeaturedStoryProps) => {
	const { content, full_slug, name } = story;

	const storyType = getNewsType(content.component);

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	const headingLink =
		storyType === newsTypes.inDepthArticle ? (
			<a href={content.link.url || content.link.cached_url}>{name}</a>
		) : (
			<Link href={full_slug}>{name}</Link>
		);

	// Fall back to podcast placeholder image if none is supplied
	const image = content.image?.filename || defaultPodcastImage;

	return (
		<article className={styles.story}>
			<div
				className={styles.imageContainer}
				style={{ backgroundImage: `url(${image})` }}
			></div>
			<div className={styles.content}>
				<HeadingElement className={styles.heading}>
					{headingLink}
				</HeadingElement>
				<p>{content.introText}</p>
				<footer>
					<Tag outline>{storyType}</Tag>
					<span className={styles.date}>{friendlyDate(content.date)}</span>
				</footer>
			</div>
		</article>
	);
};