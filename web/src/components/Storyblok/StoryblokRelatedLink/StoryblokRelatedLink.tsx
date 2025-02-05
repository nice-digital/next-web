import React from "react";
import { Link } from "@/components/Link/Link";
import { MultilinkStoryblok, RelatedLinkStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface StoryblokRelatedLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	blok: RelatedLinkStoryblok;
}

export const StoryblokRelatedLink: React.FC<StoryblokRelatedLinkProps> = ({
	blok,
	...restProps
}) => {
	// TODO: check if we are handling to href props of the link component correctly

	let Tag: React.ElementType;
	let linkDestination = undefined;
	const resolvedLink = resolveStoryblokLink(blok.link as MultilinkStoryblok);

	if (resolvedLink.url) {
		Tag = resolvedLink.isInternal ? Link : "a";
		linkDestination = resolvedLink.url;
	} else {
		return null;
	}

	return (
		<Tag href={linkDestination} {...restProps}>
			{blok.title}
		</Tag>
	);
};
