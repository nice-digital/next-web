import Link from "next/link";
import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { StoryblokAuthor } from "@/components/Storyblok/StoryblokAuthor/StoryblokAuthor";
import { type NewsStory } from "@/types/News";
import { type AuthorStoryblok } from "@/types/storyblok";
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
	const absolute_full_slug = `/${full_slug}`;

	// Fall back to podcast placeholder image if none is supplied
	const image =
		`"${content.image?.filename}/m/868x0/filters:quality(80)"` ||
		defaultPodcastImage;

	const headingLink =
		storyType === newsTypes.inDepthArticle ? (
			<a href={content.link.url || content.link.cached_url}>{name}</a>
		) : (
			<Link href={absolute_full_slug}>{name}</Link>
		);

	console.log("Featured story author:", story.content.author);

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
					{story.content.author && (
						<div className={styles.author}>
							{story.content.author.map((author: AuthorStoryblok) => {
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
					<Tag outline>{storyType}</Tag>
					<span className={styles.date}>{friendlyDate(content.date)}</span>
				</footer>
			</div>
		</article>
	);
};
