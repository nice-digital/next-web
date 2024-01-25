import React from "react";

import { RelatedNewsLinkStoryblok } from "@/types/storyblok";
import { formatDateStr } from "@/utils/datetime";

export interface StoryblokRelatedNewsLinkProps {
	blok: RelatedNewsLinkStoryblok;
}

export const StoryblokRelatedNewsLink = ({
	blok,
}: StoryblokRelatedNewsLinkProps): React.ReactElement => {
	return (
		<>
			<a href={blok.link.url} target="_blank" rel="noreferrer">
				{blok.title}
			</a>
			<p className="">
				{blok.publisher}, {formatDateStr(blok.date)}
			</p>
		</>
	);
};
