import classnames from "classnames";
import { StoryblokStory } from "storyblok-generate-ts";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { NewsStory } from "@/types/News";
import { SpotlightStoryblok, YoutubeEmbedStoryblok } from "@/types/storyblok";

import styles from "./Spotlight.module.scss";

export interface SpotlightProps {
	blok: SpotlightStoryblok;
	headingLevel?: number;
	className?: string;
}

export const Spotlight: React.FC<SpotlightProps> = ({
	blok,
	headingLevel = 2,
	className,
}: SpotlightProps) => {
	const { heading, mediaDescription, youtubeEmbed } = blok;

	// Resolve heading type
	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Resolve stories
	const stories = blok.stories as StoryblokStory<NewsStory>[];

	return (
		<section className={classnames(styles.spotlight, className)}>
			<HeadingElement className={styles.heading}>{heading}</HeadingElement>
			<div className={styles.content}>
				<div className={styles.media}>
					<figure className={styles.figure}>
						<StoryblokYoutubeEmbed
							blok={youtubeEmbed[0] as YoutubeEmbedStoryblok}
						/>
						{mediaDescription && (
							<figcaption className={styles.caption}>
								{mediaDescription}
							</figcaption>
						)}
					</figure>
				</div>
				<div className={styles.stories}>
					<ul className={styles.storyList}>
						{stories.map((story) => {
							const { content, full_slug, id, name } = story;

							// TODO: Move to utils, logic is repeated in NewsCard etc
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

							const headingLink: CardHeadingLinkProps = {
								destination: full_slug,
								elementType: Link,
							};

							return (
								<Card
									key={id}
									headingText={name}
									elementType="li"
									link={headingLink}
									image={
										<StoryblokImage
											src={content.image.filename}
											alt={content.image.alt}
										/>
									}
								>
									<Tag outline>{storyType}</Tag>
								</Card>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
};
