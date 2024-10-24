import { ISbStoryData } from "@storyblok/react";

import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { NewsStory } from "@/types/News";
import { AuthorStoryblok } from "@/types/storyblok";
import {
	friendlyDate,
	getNewsType,
	defaultPodcastImage,
	newsTypes,
	constructStoryblokImageSrc,
} from "@/utils/storyblok";

import styles from "./NewsCard.module.scss";

interface NewsCardProps {
	story: ISbStoryData<NewsStory>;
	headingLevel?: number;
	variant?: "default" | "isNewsListItem";
	showImage?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
	story,
	headingLevel = 3,
	variant,
	showImage = true,
}: NewsCardProps) => {
	const { name, content, full_slug } = story;

	const storyType = getNewsType(content.component);

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Fall back to podcast placeholder image if none is supplied
	// Updated the content image to use the new image service for optimised loading
	const image = content.image?.filename
		? constructStoryblokImageSrc(content.image?.filename, { width: 868 })
		: defaultPodcastImage;

	const absolute_full_slug = `/${full_slug}`;

	const imageLink =
		storyType === newsTypes.inDepthArticle ? (
			<a
				href={content.link.url || content.link.cached_url}
				className={styles.imageContainer}
				style={{
					backgroundImage: `url(${image})`,
				}}
				aria-hidden="true"
				tabIndex={-1}
			>
				{" "}
			</a>
		) : (
			<Link
				className={styles.imageContainer}
				href={absolute_full_slug}
				style={{
					backgroundImage: `url(${image})`,
				}}
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
			<Link href={absolute_full_slug}>{name}</Link>
		);

	return (
		<article
			className={`${styles.newsCard} ${
				variant === "isNewsListItem" ? styles.listItem : ""
			}`}
		>
			{showImage ? imageLink : null}
			<div>
				<HeadingElement className={styles.heading}>
					{headingLink}
				</HeadingElement>
				<p
					className={
						storyType === newsTypes.blogPost ? styles.blogIntroText : undefined
					}
				>
					{content.introText}
				</p>
				<footer>
					{content.author &&
						content.author.slice(0, 1).map((author: AuthorStoryblok) => {
							if (typeof author === "string") {
								return null;
							}

							const {
								content: { name, jobTitle },
								id,
							} = author;

							return (
								<div className={styles.author} key={id}>
									{name}, {jobTitle}
								</div>
							);
						})}
					<div>
						<Tag outline>{storyType}</Tag>
						<time className={styles.date} dateTime={story.content.date}>
							{friendlyDate(story.content.date)}
						</time>
					</div>
				</footer>
			</div>
		</article>
	);
};
