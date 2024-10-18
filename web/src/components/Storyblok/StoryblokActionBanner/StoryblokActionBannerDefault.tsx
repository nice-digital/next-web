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
}

export const StoryblokActionBannerDefault: React.FC<
	StoryblokActionBannerDefaultProps
> = ({ blok, className = undefined }: StoryblokActionBannerDefaultProps) => {
	const { heading, body, cta, variant } = blok;

	return (
		<ActionBanner
			title={heading}
			variant={variant === "subtle" ? "subtle" : "default"}
			cta={<StoryblokButtonLink button={cta[0]} />}
			className={className}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};