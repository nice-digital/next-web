import React from "react";

import { RelatedLinkStoryblok } from "@/types/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink = ({
	blok,
}: StoryblokRelatedLinkProps): React.ReactElement => {
	return <a href={blok.link.url}>{blok.title}</a>;
};
