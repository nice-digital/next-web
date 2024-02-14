import { StoryblokComponent } from "@storyblok/react";
import { P } from "pino";
import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { AuthorStoryblok } from "@/types/storyblok";

import styles from "./AuthorList.module.scss";

export interface AuthorListProps {
	authors: StoryblokStory<AuthorStoryblok>[] | null;
}

export interface AuthorListRefactorProps {
	children: React.ReactElement<>;
}

export const AuthorListRefactor = ({
	children,
}: AuthorListRefactorProps): React.ReactElement => {
	return (
		<div className={styles["author-list"]}>
			<h3 className={styles["author-list__heading"]}>List of authors</h3>
			{children}
		</div>
	);
};

export const AuthorList = ({
	authors,
}: AuthorListProps): React.ReactElement | null => {
	console.log({ authors });
	if (!authors) {
		return null;
	}

	if (authors.length === 1) {
		return <StoryblokComponent blok={authors[0].content} />;
	} else {
		return (
			<div className={styles["author-list"]}>
				<h3 className={styles["author-list__heading"]}>List of authors</h3>
				{authors.map((author) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { image, ...contentWithoutImage } = author.content;
					return (
						<StoryblokComponent
							key={contentWithoutImage._uid}
							blok={contentWithoutImage}
							className={styles["author-list__item"]}
						/>
					);
				})}
			</div>
		);
	}
};
