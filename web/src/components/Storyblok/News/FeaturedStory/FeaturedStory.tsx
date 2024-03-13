import Link from "next/link";
import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { type NewsStory } from "@/types/News";
import { type AuthorStoryblok } from "@/types/storyblok";
import { friendlyDate } from "@/utils/storyblok";

import { StoryblokImage } from "../../StoryblokImage/StoryblokImage";

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
	const AuthorHeadingElement = `h${
		headingLevel + 1
	}` as keyof JSX.IntrinsicElements;

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
				<div>
					<Tag outline>{storyType}</Tag>
					<span className={styles.date}>
						{friendlyDate(story.content.date)}
					</span>
				</div>
				{story.content.author && (
					<div className={styles.author}>
						{story.content.author.map(
							(author: AuthorStoryblok, index: number) => {
								const { name, jobTitle, image } = author.content;
								return (
									<div key={author._uid}>
										{image && (
											<StoryblokImage
												src={author.content.image.filename}
												alt={author.content.image.alt}
												className={styles.authorImage}
											/>
										)}
										<div className={styles.authorContent}>
											{name && (
												<AuthorHeadingElement
													className={styles.authorName}
													key={index}
												>
													{author.content.name}
												</AuthorHeadingElement>
											)}
											{jobTitle && <p>{author.content.jobTitle}</p>}
										</div>
									</div>
								);
							}
						)}
					</div>
				)}
			</div>
		</article>
	);
};
