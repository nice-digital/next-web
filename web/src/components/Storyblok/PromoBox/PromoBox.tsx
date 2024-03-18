import classnames from "classnames";

import {
	Grid,
	GridItem,
	type Columns,
	type PullOrPush,
} from "@nice-digital/nds-grid";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import {
	YoutubeEmbedStoryblok,
	type PromoBoxStoryblok,
} from "@/types/storyblok";

import styles from "./PromoBox.module.scss";

export interface PromoBoxProps {
	blok: PromoBoxStoryblok;
	headingLevel?: number;
	className?: string;
}

export const PromoBox: React.FC<PromoBoxProps> = ({
	blok,
	headingLevel = 2,
	className = undefined,
}: PromoBoxProps) => {
	const {
		heading,
		body,
		cta,
		image,
		swapMediaSide,
		useVideo,
		youtubeEmbed,
		isTransparent,
	} = blok;

	// Resolve heading type
	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	// Resolve grid
	const contentGridConfig = {
		cols: 7 as Columns,
		push: swapMediaSide ? (5 as PullOrPush) : undefined,
	};

	const mediaGridConfig = {
		cols: 5 as Columns,
		pull: swapMediaSide ? (7 as PullOrPush) : undefined,
	};

	// Resolve transparency
	const transparentClass = isTransparent ? styles.transparent : undefined;

	return (
		<article
			className={classnames(styles.promoBox, transparentClass, className)}
		>
			<div className={styles.container}>
				<Grid gutter="loose">
					<GridItem
						cols={12}
						sm={contentGridConfig}
						className={styles.contentContainer}
					>
						<HeadingElement className={styles.heading}>
							{heading}
						</HeadingElement>
						{body && (
							<div className={styles.body}>
								<StoryblokRichText content={body} />
							</div>
						)}
						{cta?.length && <StoryblokButtonLink button={cta[0]} />}
					</GridItem>
					<GridItem
						cols={12}
						sm={mediaGridConfig}
						className={styles.mediaContainer}
					>
						{useVideo && youtubeEmbed?.length ? (
							<StoryblokYoutubeEmbed
								blok={youtubeEmbed[0] as YoutubeEmbedStoryblok}
							/>
						) : (
							<StoryblokImage
								src={image?.filename}
								alt={image?.alt}
								serviceOptions={{ quality: 80 }}
							/>
						)}
					</GridItem>
				</Grid>
			</div>
		</article>
	);
};
