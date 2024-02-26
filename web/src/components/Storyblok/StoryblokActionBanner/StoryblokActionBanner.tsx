import { ActionBanner } from "@nice-digital/nds-action-banner";

import { ActionBannerStoryblok } from "@/types/storyblok";

interface StoryblokActionBannerProps {
	blok: ActionBannerStoryblok;
}

export const StoryblokActionBanner: React.FC<StoryblokActionBannerProps> = (
	blok: StoryblokActionBannerProps
) => (
	<ActionBanner title={blok.blok.heading}>
		TODO: add rich text content, buttons and the rest of the shiz
	</ActionBanner>
);
