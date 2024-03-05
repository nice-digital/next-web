import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { ActionBannerStoryblok, RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokActionBannerProps {
	blok: ActionBannerStoryblok;
}

export const StoryblokActionBanner: React.FC<StoryblokActionBannerProps> = ({
	blok,
}: StoryblokActionBannerProps) => {
	const { heading, body, cta, image } = blok;

	return (
		<ActionBanner
			title={heading}
			variant="fullWidth"
			cta={<StoryblokButtonLink button={cta[0]} />}
			image={image.filename}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
