import React from "react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokAuthor.module.scss";

export interface StoryblokAuthorProps {
	blok: AuthorStoryblok;
	className?: string;
}

export const StoryblokAuthor = ({
	blok,
}: StoryblokAuthorProps): React.ReactElement | null => {
	if (!blok) {
		return null;
	}

	return (
		<div
			className={styles.author}
			data-testid={`author-component-${blok._uid}`}
		>
			{blok.image && (
				<StoryblokImage
					src={blok.image.filename}
					alt={blok.image.alt}
					width={136}
					height={136}
					className={styles["author__image"]}
				/>
			)}
			{blok.name && <h4 className={styles["author__name"]}>{blok.name}</h4>}
			{blok.jobTitle && (
				<p className={styles["author__job-title"]}>{blok.jobTitle}</p>
			)}
		</div>
	);
};
