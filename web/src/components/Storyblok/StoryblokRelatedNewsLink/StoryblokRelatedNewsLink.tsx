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
	// TODO: handle to and href props correctly for internal and external links
	return (
		<>
			<Link href={blok.link.url} target="_blank" rel="noreferrer">
				{blok.title}
			</Link>
			<p className="">
				{blok.publisher},{" "}
				<time dateTime={blok.date}>{formatDateStr(blok.date)}</time>
			</p>
		</>
	);
};
