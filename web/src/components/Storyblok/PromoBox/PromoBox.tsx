import classnames from "classnames";

import {
	Grid,
	GridItem,
	type Columns,
	type PullOrPush,
} from "@nice-digital/nds-grid";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokYoutubeEmbed } from "@/components/Storyblok/StoryblokYoutubeEmbed/StoryblokYoutubeEmbed";
import {
	YoutubeEmbedStoryblok,
	type PromoBoxStoryblok,
} from "@/types/storyblok";
import { constructStoryblokImageSrc } from "@/utils/storyblok";
import { toTitleCase } from "@/utils/string";

import { CardGridSection } from "../CardGridSection/CardGridSection";
import { StoryblokActionBannerDefault } from "../StoryblokActionBanner/StoryblokActionBannerDefault";

import styles from "./PromoBox.module.scss";

export interface PromoBoxProps {
	blok: PromoBoxStoryblok;
	className?: string;
}

export const PromoBox: React.FC<PromoBoxProps> = ({
	blok,
	className = undefined,
}: PromoBoxProps) => {
	const {
		heading,
		body,
		cta,
		media,
		swapMediaSide,
		isTransparent,
		headingLevel = "2",
		verticalPadding = "medium",
		imageAspectRatio = "landscape",
		_uid
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	const contentGridConfig = {
		cols: 7 as Columns,
		push: swapMediaSide ? (5 as PullOrPush) : undefined,
	};

	const mediaGridConfig = {
		cols: 5 as Columns,
		pull: swapMediaSide ? (7 as PullOrPush) : undefined,
	};

	const transparentClass = isTransparent ? styles.transparent : undefined;

	const isVideo = media.length && media[0].component === "youtubeEmbed";

	const optimisedImage = !isVideo
		? constructStoryblokImageSrc(media[0].image?.filename)
		: undefined;

	const verticalPaddingClass = `promoBox${toTitleCase(verticalPadding)}Spacing`;

	const imageAspectRatioClass = `imageContainer${toTitleCase(
		imageAspectRatio
	)}`;
	console.log("content", blok);
	const RenderTestimonialOrActionBanner: React.FC<any> = ({
		promoboxContent,
	}) => {
		const { component } = promoboxContent;
		console.log("promoboxContent", promoboxContent);
		switch (component) {
			case "cardGridRowTestimonials":
				// return null;
				return <CardGridSection blok={promoboxContent} />;
			case "actionBannerDefault":
				return (
					<GridItem cols={12} className={styles.actionBannerContainer}>
						<StoryblokActionBannerDefault blok={promoboxContent} />
					</GridItem>
				);
			default:
				return null;
		}
	};

	return (
		<article
			className={classnames(
				styles.promoBox,
				transparentClass,
				styles[verticalPaddingClass],
				className
			)}
			data-tracking="promo-box"
		>
			<div className={styles.container}>
				<Grid gutter="loose">
					<GridItem
						cols={12}
						md={contentGridConfig}
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
						{!!cta?.length && <StoryblokButtonLink button={cta[0]} />}
					</GridItem>
					<GridItem
						cols={12}
						md={mediaGridConfig}
						className={styles.mediaContainer}
					>
						{isVideo ? (
							<StoryblokYoutubeEmbed blok={media[0] as YoutubeEmbedStoryblok} />
						) : optimisedImage ? (
							<div
								className={classnames(
									styles.imageContainer,
									styles[imageAspectRatioClass],
									className
								)}
								style={{ backgroundImage: `url(${optimisedImage})` }}
							></div>
						) : null}
					</GridItem>

					{blok.content.map((item: any) => (
						<RenderTestimonialOrActionBanner promoboxContent={item} key={_uid}/>
					))}
				</Grid>
			</div>
		</article>
	);
};
