import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedNewsLinkStoryblok } from "@/types/storyblok";
import { formatDateStr } from "@/utils/datetime";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface StoryblokRelatedNewsLinkProps {
	blok: RelatedNewsLinkStoryblok;
}

export const StoryblokRelatedNewsLink = ({
	blok,
}: StoryblokRelatedNewsLinkProps): React.ReactElement => {
	// TODO: check if we are handling to href props of the link component correctly
	const resolvedLink = blok.link
		? resolveStoryblokLink(blok.link).url
		: undefined;

	return (
		<>
			<Link
				href={resolvedLink ? resolvedLink : blok.link.url}
				target="_blank"
				rel="noreferrer"
			>
				{blok.title}
			</Link>
			<p className="">
				<span>{blok.publisher}</span>
				{", "}
				<time dateTime={blok.date}>{formatDateStr(blok.date)}</time>
			</p>
		</>
	);
};
