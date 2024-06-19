import React from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { QuoteStoryblok } from "@/types/storyblok";

import styles from "./Blockquote.module.scss";

interface BlockquoteBlokProps {
	blok: QuoteStoryblok;
}

export const Blockquote = ({
	blok,
}: BlockquoteBlokProps): React.ReactElement => {
	const { quoteText, quoteAuthor } = blok;

	return (
		<figure className={styles.quote}>
			<blockquote>{render(quoteText)}</blockquote>
			<figcaption className="blockquote-footer">{quoteAuthor}</figcaption>
		</figure>
	);
};
