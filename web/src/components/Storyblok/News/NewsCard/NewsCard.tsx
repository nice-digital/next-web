import Link from "next/link";

import { Tag } from "@nice-digital/nds-tag";

import { NewsStory } from "@/types/News";

import styles from "./NewsCard.module.scss";

interface NewsCardProps {
	story: NewsStory;
	headingLevel?: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({
	story,
	headingLevel = 3,
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
		<div className={styles.newsCard}>
			<div
				className={styles.imageContainer}
				style={{ backgroundImage: `url(${content.image.filename})` }}
			>
				{/* TODO refactor Tag component so that it can accept additional classNames, otherwise we have to nest as below */}
				<span className={styles.storyType}>
					<Tag outline>{storyType}</Tag>
				</span>
			</div>
			<HeadingElement className={styles.heading}>
				<Link href={full_slug}>{name}</Link>
			</HeadingElement>
			<p>{content.introText}</p>
		</div>
	);
};
