import React from "react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokAuthor.module.scss";

export interface StoryblokAuthorProps {
	blok: AuthorStoryblok;
}

export const StoryblokAuthor = ({
	blok,
}: StoryblokAuthorProps): React.ReactElement | null => {
	if (!blok) {
		return null;
	}

	return (
		<div data-testid={`author-component-${blok._uid}`}>
			{blok.image && (
				<StoryblokImage
					src={blok.image.filename}
					alt={blok.image.alt}
					width={136}
					height={136}
					className={styles["author-image"]}
				/>
			)}
			{blok.name && <h4>{blok.name}</h4>}
			{blok.jobTitle && <p>{blok.jobTitle}</p>}
		</div>
	);
};
