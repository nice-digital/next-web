import React from "react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokAuthor.module.scss";

export const StoryblokAuthor = ({
	blok,
}: AuthorStoryblok): React.ReactElement | null => {
	console.log("blok", { blok });
	if (!blok) {
		return null;
	}

	return (
		<div>
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
