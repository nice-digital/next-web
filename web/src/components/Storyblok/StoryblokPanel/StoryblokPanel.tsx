import React from "react";
import { Panel } from "@nice-digital/nds-panel";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import { type PanelStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

export const StoryblokPanel: React.FC<{ blok: PanelStoryblok }> = ({
	blok,
}) => {
	const { heading, headingLevel, content, variant } = blok;
	const HeadingElement = `h${headingLevel || 2}` as keyof JSX.IntrinsicElements;
	console.log("Rendering StoryblokPanel with blok:", blok);
	return (
		<Panel variant={variant || "supporting"}>
			<HeadingElement>{heading}</HeadingElement>
			{content && fieldHasValidContent(content) && (
				<StoryblokRichText content={content} />
			)}
		</Panel>
	);
};
