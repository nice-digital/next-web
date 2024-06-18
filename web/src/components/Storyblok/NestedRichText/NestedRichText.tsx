import { renderRichText } from "@storyblok/react";

import { type NestedRichTextStoryblok } from "@/types/storyblok";

interface NestedRichTextBlokProps {
	blok: NestedRichTextStoryblok;
}

export const NestedRichText = ({
	blok,
}: NestedRichTextBlokProps): React.ReactElement => {
	return (
		<div
			dangerouslySetInnerHTML={{ __html: renderRichText(blok.richText) }}
		></div>
	);
};
