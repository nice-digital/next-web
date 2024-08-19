import React from "react";

import { Accordion, AccordionGroup } from "@nice-digital/nds-accordion";

import { AccordionGroupStoryblok } from "@/types/storyblok";

import { AccordionStoryblokExtended } from "../StoryblokAccordion/StoryblokAccordion";
import style from "../StoryblokAccordion/StoryblokAccordion.module.scss";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokAccordionGroupProps {
	blok: Omit<AccordionGroupStoryblok, "accordions"> & {
		accordions: AccordionStoryblokExtended[];
	};
}

export const StoryblokAccordionGroup: React.FC<
	StoryblokAccordionGroupProps
> = ({ blok }: StoryblokAccordionGroupProps) => {
	const { accordions } = blok;
	return (
		<AccordionGroup>
			{accordions.map((accordion, index) => {
				const { title, content, headingLevel, displayTitleAsHeading } =
					accordion;

				if (displayTitleAsHeading) {
					const resolvedHeadingLevel = headingLevel ?? 2;
					return (
						<Accordion
							title={title}
							displayTitleAsHeading={true}
							headingLevel={resolvedHeadingLevel}
							key={index}
						>
							<StoryblokRichText
								content={content}
								className={style.accordionRichText}
							/>
						</Accordion>
					);
				} else {
					return (
						<Accordion title={title} key={index}>
							<StoryblokRichText
								content={content}
								className={style.accordionRichText}
							/>
						</Accordion>
					);
				}
			})}
		</AccordionGroup>
	);
};
