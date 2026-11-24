import classnames from "classnames";

import styles from "./Figure.module.scss";

/**
 * Shared caption rules and markup for the Figure component.
 *
 * Figure renders React elements. NestedRichText renders an HTML string, so it
 * can't use the component directly and uses buildFigureHtml instead. Both take
 * their caption rule from getCaption and their classes from getFigureClassName
 * and Figure.module.scss, so styling and spacing are the same wherever an image
 * is captioned. Figure.test.tsx checks that the two outputs stay identical.
 */

/**
 * The caption to display for a caption value: the trimmed text, or undefined
 * when the value isn't a string or is empty or whitespace only.
 */
export const getCaption = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;

	const caption = value.trim();

	return caption.length > 0 ? caption : undefined;
};

/** The classes for the root <figure>; see Figure's inContent prop */
export const getFigureClassName = (inContent = false): string =>
	classnames(styles.figure, { [styles.inContent]: inContent });

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

export interface FigureHtmlOptions {
	/**
	 * Plain text caption. It's trimmed and HTML-escaped, and no figcaption is
	 * rendered when it's empty.
	 */
	caption?: string;
	/** As Figure's inContent prop */
	inContent?: boolean;
}

/**
 * The Figure component's markup as an HTML string, for code that renders HTML
 * rather than React elements.
 *
 * @param mediaHtml Trusted HTML for the media, e.g. from buildImgHtml. It's
 * inserted as is.
 */
export const buildFigureHtml = (
	mediaHtml: string,
	{ caption, inContent = false }: FigureHtmlOptions = {}
): string => {
	const text = getCaption(caption);

	return (
		`<figure class="${getFigureClassName(inContent)}">` +
		mediaHtml +
		(text
			? `<figcaption class="${styles.caption}">${escapeHtml(text)}</figcaption>`
			: "") +
		`</figure>`
	);
};

/** An HTML-escaped <img> tag, for use as buildFigureHtml's media */
export const buildImgHtml = (src: string, alt?: string): string =>
	`<img src="${escapeHtml(src)}" alt="${escapeHtml(alt ?? "")}" />`;
