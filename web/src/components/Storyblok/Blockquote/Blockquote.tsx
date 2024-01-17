import React, { FC } from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { QuoteStoryblok } from "@/types/storyblok";

interface BlockquoteBlokProps {
	blok: QuoteStoryblok;
}

export const Blockquote = ({
	blok,
}: BlockquoteBlokProps): React.ReactElement => {
	console.log("Blockquote blok", blok);
	const { quoteText, quoteAuthor } = blok;

	return (
		<figure>
			<blockquote className="blockquote">{render(quoteText)}</blockquote>
			<figcaption className="blockquote-footer">{quoteAuthor}</figcaption>
		</figure>
	);
};
