import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedLinkStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink = ({
	blok,
}: StoryblokRelatedLinkProps): React.ReactElement => {
	// TODO: check if we are handling to href props of the link component correctly
	const resolvedLink = blok.link
		? resolveStoryblokLink(blok.link).url
		: undefined;

	return (
		<Link href={resolvedLink ? resolvedLink : blok.link.url}>{blok.title}</Link>
	);
};
