import classnames from "classnames";

import styles from "./Figure.module.scss";
import { getCaption, getFigureClassName } from "./figureCaption";

export interface FigureProps {
	/** The media element rendered inside the figure (image, embed, etc.). */
	children: React.ReactNode;
	/**
	 * Caption content. When a non-empty string (after trimming) or a non-null
	 * ReactNode is supplied, it is rendered inside a <figcaption> beneath the
	 * media. When undefined/null/empty/whitespace-only string, no <figcaption>
	 * is rendered.
	 */
	caption?: React.ReactNode;
	/**
	 * Set when the figure sits in a flow of content, such as an image in rich
	 * text: adds the vertical spacing around the figure and makes the media fill
	 * the content width. Leave unset when the parent lays the figure out, as
	 * Spotlight does.
	 */
	inContent?: boolean;
	/** Optional extra class applied to the root <figure>. */
	className?: string;
}

export const Figure: React.FC<FigureProps> = ({
	children,
	caption,
	inContent = false,
	className,
}: FigureProps) => {
	const trimmedCaption = getCaption(caption);

	const hasCaption =
		typeof caption === "string"
			? trimmedCaption !== undefined
			: caption !== null && caption !== undefined;

	return (
		<figure className={classnames(getFigureClassName(inContent), className)}>
			{children}
			{hasCaption ? (
				<figcaption className={styles.caption}>
					{typeof caption === "string" ? trimmedCaption : caption}
				</figcaption>
			) : null}
		</figure>
	);
};
