import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";

import styles from "./CardSection.module.scss";

export interface CardSectionProps {
	//blok: CardSectionStoryblok;
	blok: any;
	headingLevel?: number;
	className?: string;
	verticalPadding?: string;
	imageAspectRatio?: string;
}

export const CardSection: React.FC<CardSectionProps> = ({ blok }: CardSectionProps) => {
	const { heading, leadText, headingLevel } = blok;
	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	return (
		<section className={styles.cardSection}>
			<HeadingElement>{heading}</HeadingElement>
			{leadText && (
				<StoryblokRichText content={leadText} />
			)}
			{/* <CardSectionList /> */}
		</section>
	);
};

// import classnames from "classnames";

// import {
// 	Grid,
// 	GridItem,
// 	type Columns,
// 	type PullOrPush,
// } from "@nice-digital/nds-grid";

// import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
// import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
// import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
// import {
// 	YoutubeEmbedStoryblok,
// 	type PromoBoxStoryblok,
// } from "@/types/storyblok";
// import { constructStoryblokImageSrc } from "@/utils/storyblok";
// import { toTitleCase } from "@/utils/string";

// import styles from "./PromoBox.module.scss";

// export interface PromoBoxProps {
// 	blok: PromoBoxStoryblok;
// 	headingLevel?: number;
// 	className?: string;
// 	verticalPadding?: string;
// 	imageAspectRatio?: string;
// }

// export const PromoBox: React.FC<PromoBoxProps> = ({
// 	blok,
// 	className = undefined,
// }: PromoBoxProps) => {
// 	const {
// 		heading,
// 		body,
// 		cta,
// 		image,
// 		swapMediaSide,
// 		useVideo,
// 		youtubeEmbed,
// 		isTransparent,
// 		headingLevel = 2,
// 		verticalPadding = "medium",
// 		imageAspectRatio = "landscape",
// 	} = blok;

// 	// Resolve heading type
// 	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

// 	// Resolve grid
// 	const contentGridConfig = {
// 		cols: 7 as Columns,
// 		push: swapMediaSide ? (5 as PullOrPush) : undefined,
// 	};

// 	const mediaGridConfig = {
// 		cols: 5 as Columns,
// 		pull: swapMediaSide ? (7 as PullOrPush) : undefined,
// 	};

// 	// Resolve transparency
// 	const transparentClass = isTransparent ? styles.transparent : undefined;

// 	const optimisedImage = image?.filename
// 		? constructStoryblokImageSrc(image?.filename)
// 		: undefined;

// 	const verticalPaddingClass = `promoBox${toTitleCase(verticalPadding)}Spacing`;

// 	const imageAspectRatioClass = `imageContainer${toTitleCase(
// 		imageAspectRatio
// 	)}`;

// 	return (
// 		<article
// 			className={classnames(
// 				styles.promoBox,
// 				transparentClass,
// 				styles[verticalPaddingClass],
// 				className
// 			)}
// 			data-tracking="promo-box"
// 		>
// 			<div className={styles.container}>
// 				<Grid gutter="loose">
// 					<GridItem
// 						cols={12}
// 						md={contentGridConfig}
// 						className={styles.contentContainer}
// 					>
// 						<HeadingElement className={styles.heading}>
// 							{heading}
// 						</HeadingElement>
// 						{body && (
// 							<div className={styles.body}>
// 								<StoryblokRichText content={body} />
// 							</div>
// 						)}
// 						{!!cta?.length && <StoryblokButtonLink button={cta[0]} />}
// 					</GridItem>
// 					<GridItem
// 						cols={12}
// 						md={mediaGridConfig}
// 						className={styles.mediaContainer}
// 					>
// 						{useVideo && youtubeEmbed?.length ? (
// 							<StoryblokYoutubeEmbed
// 								blok={youtubeEmbed[0] as YoutubeEmbedStoryblok}
// 							/>
// 						) : optimisedImage ? (
// 							<div
// 								className={classnames(
// 									styles.imageContainer,
// 									styles[imageAspectRatioClass],
// 									className
// 								)}
// 								style={{ backgroundImage: `url(${optimisedImage})` }}
// 							></div>
// 						) : null}
// 					</GridItem>
// 				</Grid>
// 			</div>
// 		</article>
// 	);
// };
