import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { ActionBannerStoryblok, RichtextStoryblok } from "@/types/storyblok";
import { constructStoryblokImageSrc } from "@/utils/storyblok";

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
			image={
				image.filename
					? constructStoryblokImageSrc(image.filename, { width: 899 })
					: undefined
			}
			className={className}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
