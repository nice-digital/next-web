import { StoryblokStory } from "storyblok-generate-ts";

import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { NewsStory } from "@/types/News";
import { AuthorStoryblok } from "@/types/storyblok";
import { friendlyDate } from "@/utils/storyblok";

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

	let storyType = "";
	switch (content.component) {
		case "blogPost":
			storyType = "Blog";
			break;
		case "newsArticle":
		default:
			storyType = "News";
			break;
	}

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	return (
		<article
			className={`${styles.newsCard} ${
				variant === "isNewsListItem" ? styles.listItem : ""
			}`}
		>
			<Link
				className={styles.imageContainer}
				href={`/${full_slug}`}
				style={{ backgroundImage: `url(${content.image.filename})` }}
				aria-hidden="true"
			>
				{" "}
			</Link>
			<div>
				<HeadingElement className={styles.heading}>
					<Link href={`/${full_slug}`}>{name}</Link>
				</HeadingElement>
				<p>{content.introText}</p>
				{content.author && (
					<div>
						{content.author.map((author: AuthorStoryblok) => {
							const {
								content: { name, jobTitle },
								_uid,
							} = author;
							return (
								<p key={_uid} className={styles.author}>
									{name}, {jobTitle}
								</p>
							);
						})}
					</div>
				)}
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
