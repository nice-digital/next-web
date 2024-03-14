import classNames from "classnames";
import React from "react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokAuthor.module.scss";

export type AuthorBlockVariant = "cardAuthor";
export interface StoryblokAuthorProps {
	blok: AuthorStoryblok;
	isCardAuthor?: boolean;
	className?: string;
	headingLevel?: number;
}

export const StoryblokAuthor = ({
	blok,
	isCardAuthor,
	className,
	headingLevel = 4,
}: StoryblokAuthorProps): React.ReactElement | null => {
	if (!blok) {
		return null;
	}

	const authorClasses = classNames(styles.author, className, {
		[styles["author--is-card-author"]]: isCardAuthor,
	});

	const HeadingLevelElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	return (
		<div
			className={authorClasses}
			data-testid={`author-component-${blok._uid}`}
		>
			{blok.image && (
				<StoryblokImage
					src={blok.image.filename}
					alt={blok.image.alt}
					width={136}
					height={136}
					className={styles.author__image}
					serviceOptions="/270x270/smart/filters:quality(80)"
				/>
			)}
			<div className={styles.author__content}>
				{blok.name && (
					<HeadingLevelElement className={styles.author__name}>
						{blok.name}
					</HeadingLevelElement>
				)}
				{blok.jobTitle && (
					<p className={styles["author__job-title"]}>{blok.jobTitle}</p>
				)}
			</div>
		</div>
	);
};
