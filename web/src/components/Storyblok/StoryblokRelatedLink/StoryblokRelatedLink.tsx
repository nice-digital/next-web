import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedLinkStoryblok } from "@/types/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink = ({
	blok,
}: StoryblokRelatedLinkProps): React.ReactElement => {
	// TODO: check if we are handling to href props of the link component correctly
	return <Link href={blok.link.url}>{blok.title}</Link>;
};
