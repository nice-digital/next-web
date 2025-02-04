import React from "react";

import { Link } from "@/components/Link/Link";
import { MultilinkStoryblok, RelatedLinkStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface StoryblokRelatedLinkProps {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink: React.FC<StoryblokRelatedLinkProps> = ({
	blok, ...rest
}: StoryblokRelatedLinkProps) => {
	// TODO: check if we are handling to href props of the link component correctly

	let Tag: React.ElementType;
	let linkDestination = undefined;
	const resolvedLink = resolveStoryblokLink(blok.link as MultilinkStoryblok);

	if (resolvedLink.url) {
		Tag = resolvedLink.isInternal ? Link : "a";
		linkDestination = resolvedLink.url;
	} else {
		return undefined;
	}

	return <Tag href={linkDestination} {...rest}>{blok.title}</Tag>;
};
