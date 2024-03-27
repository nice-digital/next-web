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

	// Resolve the classnames, and add the isCardAuthor class if the prop is true
	const authorClasses = classNames(styles.author, className, {
		[styles.isCardAuthor]: isCardAuthor,
	});

	// Resolve the heading level
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
					width={`136px`}
					height={`136px`}
					className={styles.image}
					serviceOptions={{
						height: 270,
						width: 270,
						quality: 80,
						smart: true,
					}}
				/>
			)}
			<div className={styles.author__content}>
				{blok.name && (
					<HeadingLevelElement className={styles.name}>
						{blok.name}
					</HeadingLevelElement>
				)}
				{blok.jobTitle && <p className={styles.jobTitle}>{blok.jobTitle}</p>}
			</div>
		</div>
	);
};
