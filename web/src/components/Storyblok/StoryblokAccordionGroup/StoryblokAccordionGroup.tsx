import React from "react";

import { Accordion, AccordionGroup } from "@nice-digital/nds-accordion";

import { AccordionGroupStoryblok } from "@/types/storyblok";

import style from "../StoryblokAccordion/StoryblokAccordion.module.scss";
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
				const { title, content, headingLevel, displayTitleAsHeading, variant } =
					accordion;

				return (
					<Accordion
						key={index}
						title={title}
						displayTitleAsHeading={displayTitleAsHeading}
						headingLevel={headingLevel}
						variant={variant}
					>
						<StoryblokRichText
							content={content}
							className={style.accordionRichText}
						/>
					</Accordion>
				);
			})}
		</AccordionGroup>
	);
};
