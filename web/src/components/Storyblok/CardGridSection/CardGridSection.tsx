import classnames from "classnames";
import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { StoryblokTestimonialGridItem } from "@/components/Storyblok/StoryblokTestimonialGridItem/StoryblokTestimonialGridItem";
import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { CardGridSectionStoryblok } from "@/types/storyblok";
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
		theme,
		cards: rows,
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const transparentClass = theme === "subtle" ? undefined : styles.transparent;
	const verticalPaddingClass = `cardSection${toTitleCase(
		verticalPadding
	)}Spacing`;
	const leadTextProcessed =
		leadText && fieldHasValidContent(leadText) ? leadText : null;

	return (
		<section
			className={classnames(
				styles.cardSection,
				styles[verticalPaddingClass],
				transparentClass
			)}
		>
			<div className={styles.container}>
				{heading || leadTextProcessed ? (
					<div className={styles.cardSectionListIntro}>
						{heading && (
							<HeadingElement className={styles.heading}>
								{heading}
							</HeadingElement>
						)}
						{leadTextProcessed && (
							<StoryblokRichText
								content={leadTextProcessed}
								className={styles.leadText}
							/>
						)}
					</div>
				) : undefined}

				{rows.map((row) => {
					const { columns, gridItems, _uid } = row;
					const cols = (12 / Number(columns || 1)) as Columns;

					return (
						<Grid gutter="loose" key={_uid}>
							{gridItems.map((gridItem) => {
								const {
									heading,
									body,
									link,
									image,
									quoteName,
									component,
									_uid,
								} = gridItem;
								const isCallOutVariant = component === "calloutCard";

								let cardLink: CardHeadingLinkProps | undefined = undefined;
								const resolvedLink = link
									? resolveStoryblokLink(link)
									: undefined;
								if (resolvedLink?.url) {
									cardLink = {
										destination: resolvedLink.url,
										elementType: resolvedLink.isInternal ? Link : "a",
										method: "href",
									};
								}

								return (
									<GridItem cols={12} md={cols} key={_uid}>
										{component === "testimonialGridItem" ? (
											<StoryblokTestimonialGridItem />
										) : (
											<Card
												headingText={heading}
												link={cardLink || undefined}
												callout={isCallOutVariant}
												image={
													isCallOutVariant && image && image.filename ? (
														<StoryblokImage
															src={image.filename || undefined}
															alt={image.alt || ""}
															serviceOptions={{ quality: 80 }}
														/>
													) : null
												}
											>
												{body}
											</Card>
										)}
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
