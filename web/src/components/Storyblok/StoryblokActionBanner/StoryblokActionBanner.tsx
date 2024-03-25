import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { ActionBannerStoryblok, RichtextStoryblok } from "@/types/storyblok";
import { encodeParens } from "@/utils/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokActionBannerProps {
	blok: ActionBannerStoryblok;
	className?: string;
}

export const StoryblokActionBanner: React.FC<StoryblokActionBannerProps> = ({
	blok,
	className = undefined,
}: StoryblokActionBannerProps) => {
	const { heading, body, cta, image } = blok;

	return (
		<ActionBanner
			title={heading}
			variant="fullWidth"
			cta={<StoryblokButtonLink button={cta[0]} />}
			image={encodeParens(`"${image.filename}/m/899x0/filters:quality(80)"`)}
			className={className}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
