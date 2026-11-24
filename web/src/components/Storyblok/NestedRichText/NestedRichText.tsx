import { type NestedRichTextStoryblok } from "@/types/storyblok";

import { renderNestedRichText } from "./captionedImages";

interface NestedRichTextBlokProps {
	blok: NestedRichTextStoryblok;
}

// TODO: migrate this block to render through StoryblokRichText, then delete
// captionedImages.ts. This block renders an HTML string with Storyblok's
// deprecated RichTextResolver, whereas every other rich text field renders React
// elements via StoryblokRichText. The image caption support in captionedImages.ts
// reuses Figure's markup and classes so captions work in the meantime. The
// NXT-719 @storyblok/react upgrade will force this; its TODO in captionedImages.ts
// lists what needs to change.
//
// Migrating changes markup and spacing on most info pages, so it needs a visual
// before-and-after check:
// - InfoPage.module.scss styles .nested-rich-text and its direct children, e.g.
//   heading-only blocks drop their bottom margin.
// - The StoryblokRichText wrapper zeroes the last child's bottom margin.
// - Images become <picture> elements with the full-width imageMain styling. Check
//   the headshots on /about-us/board, /about-us/executive-team and
//   /about-us/guidance-executive.
export const NestedRichText = ({
	blok,
}: NestedRichTextBlokProps): React.ReactElement => {
	return (
		<div
			className="nested-rich-text"
			dangerouslySetInnerHTML={{ __html: renderNestedRichText(blok.richText) }}
		></div>
	);
};
