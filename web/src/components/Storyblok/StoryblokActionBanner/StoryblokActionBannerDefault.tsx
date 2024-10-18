import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import {
	ActionBannerDefaultStoryblok,
	RichtextStoryblok,
} from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export interface StoryblokActionBannerDefaultProps {
	blok: ActionBannerDefaultStoryblok;
	className?: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const StoryblokActionBannerDefault: React.FC<
	StoryblokActionBannerDefaultProps
> = ({
	blok,
	className = undefined,
	headingLevel = 2,
}: StoryblokActionBannerDefaultProps) => {
	const { heading, body, cta, variant } = blok;

	return (
		<ActionBanner
			title={heading}
			variant={variant === "subtle" ? "subtle" : "default"}
			cta={<StoryblokButtonLink button={cta[0]} />}
			className={className}
			headingLevel={headingLevel}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
