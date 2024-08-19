import React from "react";

import { Accordion } from "@nice-digital/nds-accordion";

import { AccordionStoryblok, RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokAccordion.module.scss";

// Define a type that represents the allowed heading levels as numbers.
export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/*
Due to how the Accordion component is defined in the NDS, we need to extend the AccordionStoryblok type
Refining the AccordionStoryblok by omitting the original headingLevel (a string)
and replacing it with a more specific type (HeadingLevel) that restricts it to valid numbers.
*/
export type AccordionStoryblokExtended = Omit<
	AccordionStoryblok,
	"headingLevel"
> & {
	headingLevel?: HeadingLevel;
};
export interface StoryblokAccordionProps {
	blok: AccordionStoryblokExtended;
}

export const StoryblokAccordion: React.FC<StoryblokAccordionProps> = ({
	blok,
}: StoryblokAccordionProps) => {
	const { title, content, headingLevel, displayTitleAsHeading } = blok;

	if (displayTitleAsHeading) {
		const resolvedHeadingLevel = headingLevel ?? 2;
		return (
			<Accordion
				title={title}
				displayTitleAsHeading={true}
				headingLevel={resolvedHeadingLevel}
			>
				<StoryblokRichText
					content={content}
					className={styles.accordionRichText}
				/>
			</Accordion>
		);
	} else {
		return (
			<Accordion title={title}>
				<StoryblokRichText
					content={content}
					className={styles.accordionRichText}
				/>
			</Accordion>
		);
	}
};
