import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { NewsStory } from "@/types/News";
import {
	friendlyDate,
	getNewsType,
	defaultPodcastImage,
	newsTypes,
} from "@/utils/storyblok";

import styles from "./NewsCard.module.scss";

interface NewsCardProps {
	story: StoryblokStory<NewsStory>;
	headingLevel?: number;
	variant?: "default" | "isNewsListItem";
}

export const NewsCard: React.FC<NewsCardProps> = ({
	story,
	headingLevel = 3,
	variant,
}: NewsCardProps) => {
	const { name, content, full_slug } = story;

	const storyType = getNewsType(content.component);

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Fall back to podcast placeholder image if none is supplied
	const image = content.image?.filename || defaultPodcastImage;

	const imageLink =
		storyType === newsTypes.inDepthArticle ? (
			<a
				href={content.link.url || content.link.cached_url}
				className={styles.imageContainer}
				style={{ backgroundImage: `url(${image})` }}
				aria-hidden="true"
				tabIndex={-1}
			>
				{" "}
			</a>
		) : (
			<Link
				className={styles.imageContainer}
				href={full_slug}
				style={{ backgroundImage: `url(${image})` }}
				aria-hidden="true"
				tabIndex={-1}
			>
				{" "}
			</Link>
		);

	const headingLink =
		storyType === newsTypes.inDepthArticle ? (
			<a href={content.link.url || content.link.cached_url}>{name}</a>
		) : (
			<Link href={full_slug}>{name}</Link>
		);

	return (
		<article
			className={`${styles.newsCard} ${
				variant === "isNewsListItem" ? styles.listItem : ""
			}`}
		>
			{imageLink}
			<div>
				<HeadingElement className={styles.heading}>
					{headingLink}
				</HeadingElement>
				<p>{content.introText}</p>
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
