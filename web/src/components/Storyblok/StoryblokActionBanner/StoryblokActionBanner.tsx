import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { ActionBannerStoryblok, RichtextStoryblok } from "@/types/storyblok";
import { optimiseImage } from "@/utils/storyblok";

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
			image={optimiseImage({ filename: image.filename, size: "899x0" })}
			className={className}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
