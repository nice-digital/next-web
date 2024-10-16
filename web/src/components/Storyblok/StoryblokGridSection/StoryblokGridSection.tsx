import { StoryblokComponent } from "@storyblok/react";

import { FullWidthSection } from "@/components/FullWidthSection/FullWidthSection";
import { type GridSectionStoryblok } from "@/types/storyblok";

interface StoryblokGridSectionBlokProps {
	blok: GridSectionStoryblok;
}

export const StoryblokGridSection = ({
	blok,
}: StoryblokGridSectionBlokProps): React.ReactElement => {
	const { heading, theme, showHeading, lead, content, verticalPadding } = blok;

	return (
		<FullWidthSection theme={theme} verticalPadding={verticalPadding}>
			{showHeading && heading && <h2>{heading}</h2>}
			{content &&
				content.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
		</FullWidthSection>
	);
};
