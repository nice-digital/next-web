import React from "react";

import { Link } from "@/components/Link/Link";
import { RelatedNewsLinkStoryblok } from "@/types/storyblok";
import { formatDateStr } from "@/utils/datetime";

export interface StoryblokRelatedNewsLinkProps {
	blok: RelatedNewsLinkStoryblok;
}

export const StoryblokRelatedNewsLink = ({
	blok,
}: StoryblokRelatedNewsLinkProps): React.ReactElement => {
	// TODO: check if we are handling to href props of the link component correctly
	return (
		<>
			<Link href={blok.link.url} target="_blank" rel="noreferrer">
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
