import classnames from "classnames";
import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokTestimonialGridItem } from "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem";
import { StoryblokCalloutCard } from "../StoryblokCalloutCard/StoryblokCalloutCard";
import {
	TestimonialGridItemStoryblok,
	CalloutCardStoryblok,
	CalloutCardWithImageStoryblok,
	CardStoryblok,
	CardGridSectionStoryblok,
 } from "@/types/storyblok";
import { fieldHasValidContent, resolveStoryblokLink } from "@/utils/storyblok";
import { toTitleCase } from "@/utils/string";

import styles from "./CardGridSection.module.scss";

export interface CardGridSectionProps {
	blok: CardGridSectionStoryblok;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({
	blok,
}: CardGridSectionProps) => {
	const {
		heading,
		headingLevel,
		leadText,
		verticalPadding = "medium",
		theme = "subtle",
		cards: rows,
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const themeClass = `cardGridSection--${theme}`;
	const verticalPaddingClass = `cardGridSection--${verticalPadding}Spacing`;
	const leadTextProcessed =
		leadText && fieldHasValidContent(leadText) ? leadText : null;

	const RenderCardGridComponent: React.FC<{ gridItem: TestimonialGridItemStoryblok | CalloutCardStoryblok | CalloutCardWithImageStoryblok | CardStoryblok }> = ({ gridItem }) => {
		const {
			heading,
			body,
			link,
			component,
		} = gridItem;

		let cardLink: CardHeadingLinkProps | undefined = undefined;
		const resolvedLink = link && (link.url || link.cached_url)
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
				return (
					<StoryblokTestimonialGridItem
						blok={gridItem}
				 	/>
				);
			case "calloutCard":
			case "calloutCardWithImage":
				return (
					<StoryblokCalloutCard
						blok={gridItem}
					/>
				)
			case "card":
				return (
					<Card
						headingText={heading}
						link={cardLink || undefined}
					>
						{body}
					</Card>
				);
			default:
				return null;
		}
	};

	return (
		<section
			className={classnames(
				styles.cardGridSection,
				styles[verticalPaddingClass],
				styles[themeClass]
			)}
			data-testid="card-grid-section"
		>
			<div className={styles.cardGridSection__container}>
				{heading || leadTextProcessed ? (
					<div className={styles.cardGridSection__intro}>
						{heading && (
							<HeadingElement className={styles.cardGridSection__heading}>
								{heading}
							</HeadingElement>
						)}
						{leadTextProcessed && (
							<StoryblokRichText
								content={leadTextProcessed}
								className={styles.cardGridSection__leadText}
							/>
						)}
					</div>
				) : undefined}

				{rows.map((row) => {
					const { component, columns, gridItems, _uid } = row;
					const cols = (12 / Number(columns || 1)) as Columns;
					const gridElementType = component !== "cardGridRowTestimonials" && gridItems.length > 1 ? "ul" : "div";
					const gridItemElementType = gridElementType === "ul" ? "li" : "div";

					return (
						<Grid elementType={gridElementType} className={styles.cardGridSection__gridRow} gutter="loose" key={_uid}>
							{gridItems.map((gridItem) => {
								return (
									<GridItem elementType={gridItemElementType} className={styles.cardGridSection__gridItem} cols={12} md={cols} key={gridItem._uid}>
										<RenderCardGridComponent gridItem={gridItem} />
									</GridItem>
								);
							})}
						</Grid>
					);
				})}
			</div>
		</section>
	);
};
