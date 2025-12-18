import React from "react";

import { Panel } from "@nice-digital/nds-panel";

import { type PanelStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export const StoryblokPanel: React.FC<{ blok: PanelStoryblok }> = ({
	blok,
}) => {
	const { heading, headingLevel, content, variant } = blok;
	const HeadingElement = `h${headingLevel || 2}` as keyof JSX.IntrinsicElements;
	return (
		<Panel variant={variant || "supporting"} data-testid="storyblok-panel">
			<HeadingElement>{heading}</HeadingElement>
			{content && fieldHasValidContent(content) && (
				<StoryblokRichText content={content} />
			)}
		</Panel>
	);
};
