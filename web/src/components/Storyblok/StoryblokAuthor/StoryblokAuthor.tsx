import React from "react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

export const StoryblokAuthor = ({
	blok,
}: AuthorStoryblok): React.ReactElement | null => {
	if (!blok) {
		return null;
	}

	return (
		<div>
			{blok.image && (
				<StoryblokImage
					src={blok.image.filename}
					alt={blok.image.alt}
					serviceOptions="smart/"
					width={138}
					height={138}
					className="author-image"
				/>
			)}
			{blok.name && <h4>{blok.name}</h4>}
			{blok.jobTitle && <p>{blok.jobTitle}</p>}
		</div>
	);
};
