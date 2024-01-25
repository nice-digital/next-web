import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedLinkStoryblok } from "@/types/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink = ({
	blok,
}: StoryblokRelatedLinkProps): React.ReactElement => {
	return <Link to={blok.link.url}>{blok.title}</Link>;
};
