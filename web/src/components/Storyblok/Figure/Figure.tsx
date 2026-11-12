import classnames from "classnames";

import styles from "./Figure.module.scss";

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
	/** Optional extra class applied to the root <figure>. */
	className?: string;
}

export const Figure: React.FC<FigureProps> = ({
	children,
	caption,
	className,
}: FigureProps) => {
	const trimmedCaption =
		typeof caption === "string" ? caption.trim() : undefined;

	const hasCaption =
		typeof caption === "string"
			? (trimmedCaption as string).length >= 1
			: caption !== null && caption !== undefined;

	return (
		<figure className={classnames(styles.figure, className)}>
			{children}
			{hasCaption ? (
				<figcaption className={styles.caption}>
					{typeof caption === "string" ? trimmedCaption : caption}
				</figcaption>
			) : null}
		</figure>
	);
};
