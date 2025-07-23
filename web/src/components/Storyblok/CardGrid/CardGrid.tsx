import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
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

export interface CardGridProps {
	row:
		| CardGridRowTestimonialsStoryblok
		| CardGridRowBasicStoryblok
		| CardGridRowCalloutStoryblok
		| CardGridRowCalloutWithImageStoryblok;
}

export const CardGrid: React.FC<CardGridProps> = ({ row }) => {
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
					<Card
						headingText={heading}
						link={cardLink || undefined}
						summary={body}
					/>
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
	return (
		<Grid
			elementType={gridElementType}
			className={styles.cardGrid__cardGridRow}
			gutter="loose"
			equalHeight
			key={_uid}
			data-testid="card-grid"
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
							className={styles.cardGrid__cardGridItem}
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
