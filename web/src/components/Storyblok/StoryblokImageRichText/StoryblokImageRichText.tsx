import Link from "next/link";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { StoryblokCalloutCard } from "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard";
import { StoryblokTestimonialGridItem } from "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem";
import {
	CalloutCardStoryblok,
	CalloutCardWithImageStoryblok,
	CardGridRowBasicStoryblok,
	CardGridRowCalloutStoryblok,
	CardGridRowCalloutWithImageStoryblok,
	CardGridRowTestimonialsStoryblok,
	CardStoryblok,
	TestimonialGridItemStoryblok,
} from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import styles from "./CardGrid.module.scss";

interface StoryblokImageRichTextProps {
	image: any;
	content: any;
	imageSize?: "small" | "medium" | "large";
	swappable?: boolean;
	_uid?: string;
}

export const StoryblokImageRichText: React.FC<StoryblokImageRichTextProps> = ({
	image,
	content,
	imageSize = "medium",
	swappable = false,
	_uid,
}) => {
	// Map imageSize to column spans
	const sizeMap: Record<string, { img: Columns; text: Columns }> = {
		small: { img: 3 as Columns, text: 9 as Columns },
		medium: { img: 4 as Columns, text: 8 as Columns },
		large: { img: 5 as Columns, text: 7 as Columns },
	};
	const { img: imgCols, text: textCols } = sizeMap[imageSize] || sizeMap.medium;

	// If swappable, image on right, else image on left
	const imageFirst = !swappable;

	return (
		<Grid
			className={styles.cardGrid__cardGridRow}
			gutter="loose"
			equalHeight
			key={_uid}
			data-testid="card-grid"
		>
			{imageFirst ? (
				<>
					<GridItem
						className={styles.cardGrid__cardGridItem}
						cols={12}
						md={imgCols}
					>
						{image}
					</GridItem>
					<GridItem
						className={styles.cardGrid__cardGridItem}
						cols={12}
						md={textCols}
					>
						{content}
					</GridItem>
				</>
			) : (
				<>
					<GridItem
						className={styles.cardGrid__cardGridItem}
						cols={12}
						md={textCols}
					>
						{content}
					</GridItem>
					<GridItem
						className={styles.cardGrid__cardGridItem}
						cols={12}
						md={imgCols}
					>
						{image}
					</GridItem>
				</>
			)}
		</Grid>
	);
};
