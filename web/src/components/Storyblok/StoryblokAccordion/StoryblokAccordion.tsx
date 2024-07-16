import React from "react";

import { Accordion } from "@nice-digital/nds-accordion";

import { AccordionStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokAccordionProps {
	blok: AccordionStoryblok;
}

export const StoryblokAccordion: React.FC<StoryblokAccordionProps> = ({
	blok,
}: StoryblokAccordionProps) => {
	const { title, content, displayTitleAsHeading, headingLevel } = blok;
	return (
		<Accordion title={title}>
			{displayTitleAsHeading ? "showTitleAsHeading" : "no showTitleAsHeading"}
			{headingLevel}
			<StoryblokRichText content={content} />
		</Accordion>
	);
};
