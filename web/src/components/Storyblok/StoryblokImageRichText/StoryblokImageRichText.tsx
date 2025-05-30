import React from "react";

import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { ImageRichTextStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokImageRichText.module.scss";

interface StoryblokImageRichTextProps {
	blok: ImageRichTextStoryblok;
	className?: string;
}

export const StoryblokImageRichText: React.FC<StoryblokImageRichTextProps> = ({
	blok,
}) => {
	const {
		image,
		content,
		imageSize = "medium",
		imagePosition = "right",
		hideImage = false,
		smallScreenImage,
		_uid,
	} = blok;
	// Map imageSize to column spans
	const sizeMap: Record<string, { img: Columns; text: Columns }> = {
		small: { img: 3 as Columns, text: 9 as Columns },
		medium: { img: 4 as Columns, text: 8 as Columns },
		large: { img: 5 as Columns, text: 7 as Columns },
	};
	const { img: imgCols, text: textCols } = sizeMap[imageSize] || sizeMap.medium;

	// If imagePosition is "left", image on left; if "right", image on right (default)
	const imageFirst = imagePosition !== "right";

	// Render image for desktop (>=600px)
	const desktopImg =
		image && image.filename ? (
			<StoryblokImage
				src={image.filename}
				alt={image.alt || ""}
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
	// Render rich text content if content is a Storyblok rich text object
	const richContent = content?.content?.[0]?.content?.[0]?.text ? (
		<p>{content.content[0].content[0].text}</p>
	) : null;
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
						className={hideImage ? styles.imageRichText__hideImageOnMobile : ""}
					>
						{smallScreenImage && smallScreenImage.filename ? (
							<>
								<span className={styles.imageRichText__mobileOnly}>
									{mobileImg}
								</span>
								<span className={styles.imageRichText__desktopOnly}>
									{desktopImg}
								</span>
							</>
						) : (
							<span className={styles.imageRichText__desktopOnly}>
								{desktopImg}
							</span>
						)}
					</GridItem>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="image-richtext-grid-item"
					>
						{richContent}
					</GridItem>
				</>
			) : (
				<>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="image-richtext-grid-item"
					>
						{richContent}
					</GridItem>
					<GridItem
						data-testid="image-richtext-grid-item"
						cols={12}
						md={imgCols}
						className={hideImage ? styles.imageRichText__hideImageOnMobile : ""}
					>
						{smallScreenImage && smallScreenImage.filename ? (
							<>
								<span className={styles.imageRichText__mobileOnly}>
									{mobileImg}
								</span>
								<span className={styles.imageRichText__desktopOnly}>
									{desktopImg}
								</span>
							</>
						) : (
							<span className={styles.imageRichText__desktopOnly}>
								{desktopImg}
							</span>
						)}
					</GridItem>
				</>
			)}
		</Grid>
	);
};
