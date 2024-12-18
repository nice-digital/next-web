import { ISbStoryData } from "@storyblok/react";
import Link from "next/link";

import { Tag } from "@nice-digital/nds-tag";

import { StoryblokAuthor } from "@/components/Storyblok/StoryblokAuthor/StoryblokAuthor";
import { type NewsStory } from "@/types/News";
import { type AuthorStoryblok } from "@/types/storyblok";
import {
	friendlyDate,
	getNewsType,
	defaultPodcastImage,
	newsTypes,
	constructStoryblokImageSrc,
} from "@/utils/storyblok";

import styles from "./FeaturedStory.module.scss";

interface FeaturedStoryProps {
	story: ISbStoryData<NewsStory>;
	headingLevel?: number;
}

export const FeaturedStory: React.FC<FeaturedStoryProps> = ({
	story,
	headingLevel = 3,
}: FeaturedStoryProps) => {
	const { content, full_slug, name } = story;

	const storyType = getNewsType(content.component);

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const absolute_full_slug = `/${full_slug}`;

	const headingLink =
		storyType === newsTypes.inDepthArticle ? (
			<a href={content.link.url || content.link.cached_url}>{name}</a>
		) : (
			<Link href={absolute_full_slug}>{name}</Link>
		);

	// Fall back to podcast placeholder image if none is supplied
	const image = content.image?.filename
		? constructStoryblokImageSrc(content.image?.filename, { width: 868 })
		: defaultPodcastImage;

	return (
		<article className={styles.story}>
			<div
				className={styles.imageContainer}
				style={{
					backgroundImage: `url(${image})`,
				}}
			></div>
			<div className={styles.content}>
				<HeadingElement className={styles.heading}>
					{headingLink}
				</HeadingElement>
				<p>{content.introText}</p>
				<footer>
					<Tag outline>{storyType}</Tag>
					<time className={styles.date} dateTime={content.date}>
						{friendlyDate(content.date)}
					</time>

					{story.content.author && (
						<div className={styles.author}>
							{story.content.author
								.slice(0, 1)
								.map((author: AuthorStoryblok) => {
									return (
										<StoryblokAuthor
											key={author.id}
											blok={author.content}
											isCardAuthor={true}
											headingLevel={headingLevel + 1}
										/>
									);
								})}
						</div>
					)}
				</footer>
			</div>
		</article>
	);
};
