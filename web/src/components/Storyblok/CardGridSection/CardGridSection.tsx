import classnames from "classnames";

import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import {
	CardGridSectionStoryblok,
	CardGridRowTestimonialsStoryblok,
	CardGridRowBasicStoryblok,
	CardGridRowCalloutStoryblok,
	CardGridRowCalloutWithImageStoryblok,
} from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

import styles from "./CardGridSection.module.scss";

export interface CardGridSectionProps {
	blok: CardGridSectionStoryblok | CardGridRowTestimonialsStoryblok;
}

export const CardGridSection: React.FC<CardGridSectionProps> = ({
	blok,
}: CardGridSectionProps) => {
	const {
		heading,
		headingLevel,
		leadText,
		secondaryLeadText,
		verticalPadding = "medium",
		theme = "subtle",
		cards: rows,
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const themeClass = `cardGridSection--${theme}`;
	const verticalPaddingClass = `cardGridSection--${verticalPadding}Spacing`;
	const leadTextProcessed =
		leadText && fieldHasValidContent(leadText) ? leadText : null;
	const secondaryLeadTextProcessed =
		secondaryLeadText && fieldHasValidContent(secondaryLeadText)
			? secondaryLeadText
			: null;

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
						{leadTextProcessed && secondaryLeadTextProcessed && (
							<StoryblokRichText
								content={secondaryLeadTextProcessed}
								className={styles.cardGridSection__leadTextSecondary}
							/>
						)}
					</div>
				) : undefined}
				{rows.map(
					(
						row:
							| CardGridRowTestimonialsStoryblok
							| CardGridRowBasicStoryblok
							| CardGridRowCalloutStoryblok
							| CardGridRowCalloutWithImageStoryblok
					) => (
						<CardGrid row={row} key={row._uid} />
					)
				)}
			</div>
		</section>
	);
};
