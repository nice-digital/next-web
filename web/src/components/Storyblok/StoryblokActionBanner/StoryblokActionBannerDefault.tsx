import classnames from "classnames";

import { ActionBanner } from "@nice-digital/nds-action-banner";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import {
	ActionBannerDefaultStoryblok,
	RichtextStoryblok,
} from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokActionBannerDefault.module.scss";

export interface StoryblokActionBannerDefaultProps {
	blok: ActionBannerDefaultStoryblok;
	className?: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	isStandAlone?: boolean;
}

export const StoryblokActionBannerDefault: React.FC<
	StoryblokActionBannerDefaultProps
> = ({
	blok,
	className = undefined,
	headingLevel = 2,
	isStandAlone = true,
}: StoryblokActionBannerDefaultProps) => {
	const { heading, body, cta, variant } = blok;
	const defaultActionBannerClasses = classnames({
		[styles.actionBannerDefault]: isStandAlone,
		className,
	});
	return (
		<ActionBanner
			title={heading}
			variant={variant === "subtle" ? "subtle" : "default"}
			cta={<StoryblokButtonLink button={cta[0]} />}
			className={defaultActionBannerClasses}
			headingLevel={headingLevel}
		>
			<StoryblokRichText content={body as RichtextStoryblok} />
		</ActionBanner>
	);
};
