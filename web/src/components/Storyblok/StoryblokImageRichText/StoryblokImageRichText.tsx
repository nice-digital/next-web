import React from "react";

import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { ImageRichTextStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokImageRichText.module.scss";

interface StoryblokImageRichTextProps {
	blok: ImageRichTextStoryblok;
	className?: string;
}

export const StoryblokImageRichText: React.FC<StoryblokImageRichTextProps> = ({
	blok,
}) => {
	const {
		mainImage,
		content,
		imageSize = "medium",
		imagePosition = "right",
		hideImagesOnSmallScreens = "false",
		smallScreenImage,
		_uid,
	} = blok;

	const sizeMap: Record<string, { img: Columns; text: Columns }> = {
		small: { img: 3 as Columns, text: 9 as Columns },
		medium: { img: 4 as Columns, text: 8 as Columns },
		large: { img: 5 as Columns, text: 7 as Columns },
	};
	const { img: imgCols, text: textCols } = sizeMap[imageSize] || sizeMap.medium;

	const imageFirst = imagePosition !== "right";

	// Detect if any block in content is a heading
	const contentStartsWithHeading =
		Array.isArray(content?.content) &&
		content.content.some((block) => block.type === "heading");

	const imageVisibilityOnSmallScreens =
		hideImagesOnSmallScreens === "false" ? false : true;

	// Helper for image GridItem className
	const imageGridItemClass = [
		imageVisibilityOnSmallScreens
			? styles.imageRichText__hideImageOnMobile
			: null,
		contentStartsWithHeading ? styles.imageRichText__imageWithHeading : null,
	]
		.filter(Boolean)
		.join(" ");

	// Helper for desktop image span className
	const desktopSpanClass = [
		styles.imageRichText__desktopOnly,
		!contentStartsWithHeading
			? styles.imageRichText__imageWithoutHeading
			: null,
	]
		.filter(Boolean)
		.join(" ");

	// Render image for desktop (>=600px)
	const desktopImg =
		mainImage && mainImage.filename ? (
			<StoryblokImage
				src={mainImage.filename}
				alt={mainImage.alt || ""}
				className={styles.imageRichText__desktopOnly}
			/>
		) : null;

	// Render image for mobile/tablet (<600px)
	const mobileImg =
		smallScreenImage && smallScreenImage.filename ? (
			<StoryblokImage
				src={smallScreenImage.filename}
				alt={smallScreenImage.alt || ""}
				className={styles.imageRichText__mobileOnly}
			/>
		) : null;

	const renderImageSpans = () =>
		smallScreenImage && smallScreenImage.filename ? (
			<>
				<span className={styles.imageRichText__mobileOnly}>{mobileImg}</span>
				<span className={desktopSpanClass}>{desktopImg}</span>
			</>
		) : (
			<span className={desktopSpanClass}>{desktopImg}</span>
		);

	return (
		<Grid
			key={_uid}
			data-testid="image-richtext"
			className={styles.imageRichText}
		>
			{imageFirst ? (
				<>
					<GridItem
						data-testid="image-richtext-grid-item"
						cols={12}
						md={imgCols}
						className={imageGridItemClass}
					>
						{renderImageSpans()}
					</GridItem>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="image-richtext-grid-item"
					>
						<StoryblokRichText content={content} />
					</GridItem>
				</>
			) : (
				<>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="image-richtext-grid-item"
					>
						<StoryblokRichText content={content} />
					</GridItem>
					<GridItem
						data-testid="image-richtext-grid-item"
						cols={12}
						md={imgCols}
						className={imageGridItemClass}
					>
						{renderImageSpans()}
					</GridItem>
				</>
			)}
		</Grid>
	);
};
