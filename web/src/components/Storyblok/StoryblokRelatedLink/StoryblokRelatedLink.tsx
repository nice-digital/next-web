import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedLinkStoryblok } from "@/types/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink = ({
	blok,
}: StoryblokRelatedLinkProps): React.ReactElement => {
	// TODO: handle to and href props correctly for internal and external links
	return <Link href={blok.link.url}>{blok.title}</Link>;
};
