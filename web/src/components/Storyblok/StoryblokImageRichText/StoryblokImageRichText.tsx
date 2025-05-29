import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";
import { ImageRichTextStoryblok } from "@/types/storyblok";
import styles from "./StoryblokImageRichText.module.scss";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

interface StoryblokImageRichTextProps {
	blok: ImageRichTextStoryblok;
	className?: string;
}

export const StoryblokImageRichText: React.FC<StoryblokImageRichTextProps> = ({
	blok,
}) => {
	// Accept a 'blok' prop and use its values if present
	const {
		image,
		content,
		imageSize = "medium",
		imagePosition = "right", // changed from swappable to imagePosition
		hideImage = false,
		smallScreenImage,
		_uid,
	} = blok;

	const containerRef = useRef<HTMLDivElement>(null);
	const [isAbove600, setIsAbove600] = useState(true);

	useEffect(() => {
		if (!containerRef.current) return;
		const observer = new window.ResizeObserver((entries) => {
			for (let entry of entries) {
				const width = entry.contentRect.width;
				setIsAbove600(width >= 600);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

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
		) : (
			image
		);

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
	const richContent =
		content && content.content
			? content.content.map((block: any, i: number) =>
					block.content
						? block.content.map((c: any, j: number) =>
								c.text ? <p key={`${i}-${j}`}>{c.text}</p> : null
						  )
						: null
			  )
			: content;

	// Only hide image if hideImage is true AND container is below 600px
	const shouldHideImage = hideImage && !isAbove600;

	return (
		<div ref={containerRef} className={styles.imageRichText}>
			<Grid key={_uid} data-testid="image-richtext">
				{imageFirst ? (
					<>
						{!shouldHideImage && (
							<GridItem cols={12} md={imgCols}>
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
						)}
						<GridItem cols={12} md={textCols}>
							{richContent}
						</GridItem>
					</>
				) : (
					<>
						<GridItem cols={12} md={textCols}>
							{richContent}
						</GridItem>
						{!shouldHideImage && (
							<GridItem cols={12} md={imgCols}>
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
						)}
					</>
				)}
			</Grid>
		</div>
	);
};
