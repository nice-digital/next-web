import React from "react";

import { Accordion, AccordionGroup } from "@nice-digital/nds-accordion";

import { AccordionGroupStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokAccordionGroupProps {
	blok: AccordionGroupStoryblok;
}

export const StoryblokAccordionGroup: React.FC<
	StoryblokAccordionGroupProps
> = ({ blok }: StoryblokAccordionGroupProps) => {
	const { accordions } = blok;
	return (
		<AccordionGroup>
			{accordions.map((accordion, index) => {
				const { title, content, displayTitleAsHeading, headingLevel } =
					accordion;
				return (
					<Accordion title={title} key={index}>
						{displayTitleAsHeading
							? "showTitleAsHeading"
							: "no showTitleAsHeading"}
						{headingLevel}
						<StoryblokRichText content={content} />
					</Accordion>
				);
			})}
		</AccordionGroup>
	);
};
