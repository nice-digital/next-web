import React, { FC } from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { QuoteStoryblok } from "@/types/storyblok";

import styles from "./Blockquote.module.scss";

/**
 * TODO: refactor this component. We might want to change the markup to not use a figure element.
 */
interface BlockquoteBlokProps {
	blok: QuoteStoryblok;
}

export const Blockquote = ({
	blok,
}: BlockquoteBlokProps): React.ReactElement => {
	console.log("Blockquote blok", blok);
	const { quoteText, quoteAuthor } = blok;

	return (
		<figure className={styles.quote}>
			<blockquote>{render(quoteText)}</blockquote>
			<figcaption className="blockquote-footer">{quoteAuthor}</figcaption>
		</figure>
	);
};
