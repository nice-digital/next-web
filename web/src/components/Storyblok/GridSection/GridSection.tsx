import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Columns, Grid, GridItem } from "@nice-digital/nds-grid";

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

import { StoryblokCalloutCard } from "../StoryblokCalloutCard/StoryblokCalloutCard";
import { StoryblokTestimonialGridItem } from "../StoryblokTestimonialGridItem/StoryblokTestimonialGridItem";

import styles from "./GridSection.module.scss";

export interface GridSectionProps {
	row:
		| CardGridRowTestimonialsStoryblok
		| CardGridRowBasicStoryblok
		| CardGridRowCalloutStoryblok
		| CardGridRowCalloutWithImageStoryblok;
}

export const GridSection: React.FC<GridSectionProps> = ({ row }) => {
	const RenderCardGridComponent: React.FC<{
		gridItem:
			| TestimonialGridItemStoryblok
			| CalloutCardStoryblok
			| CalloutCardWithImageStoryblok
			| CardStoryblok;
	}> = ({ gridItem }) => {
		const { heading, body, link, component } = gridItem;

		let cardLink: CardHeadingLinkProps | undefined = undefined;
		const resolvedLink =
			link && (link.url || link.cached_url)
				? resolveStoryblokLink(link)
				: undefined;
		if (resolvedLink?.url) {
			cardLink = {
				destination: resolvedLink.url,
				elementType: resolvedLink.isInternal ? Link : "a",
				method: "href",
			};
		}

		switch (component) {
			case "testimonialGridItem":
				return <StoryblokTestimonialGridItem blok={gridItem} />;
			case "calloutCard":
			case "calloutCardWithImage":
				return <StoryblokCalloutCard blok={gridItem} />;
			case "card":
				return (
					<Card headingText={heading} link={cardLink || undefined}>
						{body}
					</Card>
				);
			default:
				return null;
		}
	};

	const { component, columns, gridItems, _uid } = row;
	const cols = (12 / Number(columns || 1)) as Columns;
	const gridElementType =
		component !== "cardGridRowTestimonials" ? "ul" : "div";
	const gridItemElementType = gridElementType === "ul" ? "li" : "div";
	console.log("card section row", row);
	return (
		<Grid
			elementType={gridElementType}
			className={styles.gridSection__gridRow}
			gutter="loose"
			equalHeight
			key={_uid}
			data-testid="grid-section"
		>
			{gridItems.map(
				(
					gridItem:
						| TestimonialGridItemStoryblok
						| CardStoryblok
						| CalloutCardStoryblok
						| CalloutCardWithImageStoryblok
				) => {
					return (
						<GridItem
							elementType={gridItemElementType}
							className={styles.gridSection__gridItem}
							cols={12}
							md={cols}
							key={gridItem._uid}
						>
							<RenderCardGridComponent gridItem={gridItem} />
						</GridItem>
					);
				}
			)}
		</Grid>
	);
};
