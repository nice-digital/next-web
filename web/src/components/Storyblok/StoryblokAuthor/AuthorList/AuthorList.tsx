import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokAuthor } from "../StoryblokAuthor";

import styles from "./AuthorList.module.scss";

export interface AuthorListProps {
	authors: StoryblokStory<AuthorStoryblok>[];
}

export interface AuthorListRefactorProps {
	children: React.ReactElement;
}

export const AuthorList = ({
	authors,
}: AuthorListProps): React.ReactElement | null => {
	if (!authors || authors.length === 0) {
		return null;
	}

	const sortedAuthorsArray = authors.sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	return (
		<div className={styles.authorList}>
			<h2 className={styles.heading}>List of authors</h2>
			{sortedAuthorsArray.map((author) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { image, ...contentWithoutImage } = author.content;
				return (
					<StoryblokAuthor
						key={contentWithoutImage._uid}
						blok={contentWithoutImage}
						className={styles["author-list__item"]}
						headingLevel={3}
					/>
				);
			})}
		</div>
	);
};
