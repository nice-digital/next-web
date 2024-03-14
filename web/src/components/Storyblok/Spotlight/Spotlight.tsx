import classnames from "classnames";
import { StoryblokStory } from "storyblok-generate-ts";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { NewsStory } from "@/types/News";
import { SpotlightStoryblok, YoutubeEmbedStoryblok } from "@/types/storyblok";
import { defaultPodcastImage, getNewsType } from "@/utils/storyblok";

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
	const { heading, mediaDescription, youtubeEmbed, component, isTransparent } =
		blok;

	// Resolve heading type
	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Resolve stories
	const stories = blok.stories as StoryblokStory<NewsStory>[];

	// Resolve transparency
	const transparentClass = isTransparent ? styles.transparent : undefined;

	// Resolve story type
	const storyType = getNewsType(component);

	return (
		<section
			className={classnames(styles.spotlight, transparentClass, className)}
		>
			<div className={styles.container}>
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

								const headingLink: CardHeadingLinkProps = {
									destination: full_slug,
									elementType: Link,
								};

								// Fall back to podcast placeholder image if none is supplied
								const image = content.image?.filename || defaultPodcastImage;

								return (
									<Card
										key={id}
										headingText={name}
										elementType="li"
										link={headingLink}
										image={
											<StoryblokImage
												src={image}
												alt={content.image?.alt || ""}
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
			</div>
		</section>
	);
};
