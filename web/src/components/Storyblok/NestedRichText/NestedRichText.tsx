import { renderRichText } from "@storyblok/react";
import classnames from "classnames";

import { type NestedRichTextStoryblok } from "@/types/storyblok";

import styles from "./NestedRichText.module.scss";

interface NestedRichTextBlokProps {
	blok: NestedRichTextStoryblok;
	className?: string;
}

export const NestedRichText = ({
	blok,
	className,
}: NestedRichTextBlokProps): React.ReactElement => {
	const nestedRichTextClassNames = classnames(styles.nestedRichText, className);
	return (
		<div
			className={nestedRichTextClassNames}
			dangerouslySetInnerHTML={{ __html: renderRichText(blok.richText) }}
		></div>
	);
};
