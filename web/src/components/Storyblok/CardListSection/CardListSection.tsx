import classnames from "classnames";
import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";

import { CardList } from "@/components/Storyblok/CardList/CardList";
import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { CardListSectionStoryblok } from "@/types/storyblok";
import { fieldHasValidContent, resolveStoryblokLink } from "@/utils/storyblok";
import { toTitleCase } from "@/utils/string";

import styles from "./CardListSection.module.scss";

export interface CardListSectionProps {
	blok: CardListSectionStoryblok;
}

export const CardListSection: React.FC<CardListSectionProps> = ({
	blok,
}: CardListSectionProps) => {
	const {
		heading,
		headingLevel,
		leadText,
		secondaryLeadText,
		verticalPadding = "medium",
		theme,
		cards,
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const transparentClass = theme === "subtle" ? undefined : styles.transparent;
	const verticalPaddingClass = `cardSection${toTitleCase(
		verticalPadding
	)}Spacing`;
	const leadTextProcessed =
		leadText && fieldHasValidContent(leadText) ? leadText : null;
	const secondaryLeadTextProcessed =
		secondaryLeadText && fieldHasValidContent(secondaryLeadText)
			? secondaryLeadText
			: null;

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
						{leadTextProcessed && secondaryLeadTextProcessed && (
							<StoryblokRichText
								content={secondaryLeadTextProcessed}
								className={styles.leadTextSecondary}
							/>
						)}
					</div>
				) : undefined}

				<CardList
					blok={{
						cards: cards,
						component: "cardList",
						_uid: blok._uid,
					}}
				/>
			</div>
		</section>
	);
};
