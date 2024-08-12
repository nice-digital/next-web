import React from "react";

import { Accordion } from "@nice-digital/nds-accordion";

import { AccordionStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokAccordion.module.scss";

export interface StoryblokAccordionProps {
	blok: AccordionStoryblok;
}

export const StoryblokAccordion: React.FC<StoryblokAccordionProps> = ({
	blok,
}: StoryblokAccordionProps) => {
	const { title, content, headingLevel } = blok;

	const resolvedHeadingLevel = headingLevel ?? headingLevel;

	return (
		<Accordion title={title} headingLevel={resolvedHeadingLevel}>
			<StoryblokRichText
				content={content}
				className={styles.accordionRichText}
			/>
		</Accordion>
	);
};
