import { ISbStoryData } from "@storyblok/react";
import classnames from "classnames";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Tag } from "@nice-digital/nds-tag";

import { Link } from "@/components/Link/Link";
import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import { NewsStory } from "@/types/News";
import { SpotlightStoryblok, YoutubeEmbedStoryblok } from "@/types/storyblok";
import { defaultPodcastImage, getNewsType, newsTypes } from "@/utils/storyblok";

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
	const { heading, mediaDescription, youtubeEmbed, isTransparent } = blok;

	// Resolve heading type
	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Resolve stories
	const stories = blok.stories as ISbStoryData<NewsStory>[];

	// Resolve transparency
	const transparentClass = isTransparent ? styles.transparent : undefined;
	const cardHeadingLevel =
		headingLevel && headingLevel < 6
			? (headingLevel + 1).toString()
			: undefined;
	return (
		<section
			className={classnames(styles.spotlight, transparentClass, className)}
			data-tracking="spotlight"
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

								// Resolve story type
								const storyType = getNewsType(content.component);

								const headingLink: CardHeadingLinkProps =
									storyType === newsTypes.inDepthArticle
										? {
												destination:
													content.link.url || content.link.cached_url,
												elementType: "a",
										  }
										: {
												destination: full_slug,
												elementType: Link,
										  };

								// Fall back to podcast placeholder image if none is supplied
								const image = content.image?.filename || defaultPodcastImage;

								return (
									<Card
										key={id}
										headingText={name}
										headingLevel={cardHeadingLevel}
										elementType="li"
										link={headingLink}
										image={
											<StoryblokImage
												src={image}
												alt={content.image?.alt || ""}
												serviceOptions={{ height: 0, quality: 80, width: 708 }}
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
