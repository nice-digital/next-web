import { RichTextResolver, RichTextSchema } from "@storyblok/react";

import {
	getCaption,
	buildFigureHtml,
	buildImgHtml,
} from "@/components/Storyblok/Figure/figureCaption";
import { type RichtextStoryblok } from "@/types/storyblok";

/**
 * Image captions for the nested rich text block.
 *
 * NestedRichText renders to an HTML string, unlike StoryblokRichText, which
 * renders React elements. So it can't use the Figure component directly.
 * Instead, a captioned image renders the same markup from the shared helpers in
 * Figure/figureCaption.ts. That's the same <figure>/<figcaption> structure and
 * Figure.module.scss classes as rich text, including the inContent spacing, so
 * captions look and space the same in both. Images without a caption keep the
 * renderer's default markup, so existing content is unchanged.
 *
 * As in StoryblokRichText, a captioned image is lifted out of its paragraph or
 * heading first, because a <figure> isn't valid inside either. That also stops
 * a caption inheriting heading text size.
 *
 * TODO NXT-719 (upgrade @storyblok/react from 3.x): this file is built on
 * RichTextResolver and RichTextSchema. Storyblok has deprecated both in favour
 * of @storyblok/richtext, and the client warns they'll be removed in the next
 * major release. During the upgrade:
 * - Check whether RichTextResolver and RichTextSchema still exist in the target
 *   version. If they don't, nestedRichTextResolver below can't be built. Note
 *   that @storyblok/react 3.x bundles its own copy of the SDK (in
 *   dist/storyblok-js.js), so that copy is the one used at runtime, not the
 *   @storyblok/js package in node_modules.
 * - renderNestedRichText renders with the resolver directly, not via
 *   renderRichText, because of renderRichText's emptiness check (see below). In
 *   newer versions renderRichText is @storyblok/richtext's renderer, with a
 *   different signature, so recheck how it treats emptiness if switching back.
 * - Preferred route: render the block as React elements, not an HTML string.
 *   Use either our StoryblokRichText or the SDK's own StoryblokRichText (v7
 *   accepts a `components` map, so `image` could render the Figure component
 *   with inContent). Then delete this file, and delete buildFigureHtml and
 *   buildImgHtml from Figure/figureCaption.ts if nothing else uses them. See
 *   the migration notes in NestedRichText.tsx first, as this changes markup and
 *   spacing on most info pages.
 * - If the block must stay an HTML string, port the image override below to the
 *   new renderer's extension API. Keep splitCaptionedImages: it only works on
 *   the rich text JSON, so it doesn't depend on the renderer.
 * - Either way, NestedRichText.test.tsx asserts on the rendered DOM, so it
 *   should pass unchanged against the new implementation. The test comparing
 *   output with the default resolver needs updating to the new renderer.
 */

/** Images without a source can't be shown, so are never treated as captioned */
const getImageNodeCaption = (node: RichtextStoryblok): string | undefined =>
	node.type === "image" && node.attrs?.src
		? getCaption(node.attrs.title)
		: undefined;

const isCaptionedImage = (node: RichtextStoryblok): boolean =>
	getImageNodeCaption(node) !== undefined;

/** Whitespace only text and line breaks render nothing visible on their own */
const isBlankRun = (nodes: RichtextStoryblok[]): boolean =>
	nodes.every(
		(node) =>
			(node.type === "text" && (node.text ?? "").trim().length === 0) ||
			node.type === "hard_break"
	);

const SPLIT_BLOCK_TYPES = ["paragraph", "heading"];

/**
 * Splits a paragraph or heading around each captioned image so the image
 * becomes a sibling block, e.g. text, image, text becomes
 * paragraph(text), image, paragraph(text).
 */
const splitBlock = (block: RichtextStoryblok): RichtextStoryblok[] => {
	const children = block.content ?? [];

	if (
		!SPLIT_BLOCK_TYPES.includes(block.type) ||
		!children.some(isCaptionedImage)
	)
		return [block];

	const blocks: RichtextStoryblok[] = [];
	let run: RichtextStoryblok[] = [];

	const flush = () => {
		if (run.length > 0 && !isBlankRun(run)) {
			blocks.push({ ...block, content: run });
		}
		run = [];
	};

	children.forEach((child) => {
		if (isCaptionedImage(child)) {
			flush();
			blocks.push(child);
		} else {
			run.push(child);
		}
	});
	flush();

	return blocks;
};

/**
 * Lifts every captioned image out of the paragraph or heading it sits in, at any
 * depth (e.g. inside list items). Returns a new document; the input isn't
 * modified.
 */
export const splitCaptionedImages = (
	node: RichtextStoryblok
): RichtextStoryblok => {
	if (!node?.content) return node;

	return {
		...node,
		content: node.content.flatMap((child) =>
			splitBlock(splitCaptionedImages(child))
		),
	};
};

// The SDK types schema nodes as taking a DOM Element (ISbNode), but at runtime
// they're called with the rich text JSON node, so type it to match its use
const defaultImageNode = RichTextSchema.nodes.image as unknown as (
	node: RichtextStoryblok
) => object;

/** The default schema, with captioned images rendered as an in-content figure */
const nestedRichTextSchema = {
	...RichTextSchema,
	nodes: {
		...RichTextSchema.nodes,
		image: (node: RichtextStoryblok) => {
			const caption = getImageNodeCaption(node);

			if (caption === undefined) return defaultImageNode(node);

			const { src, alt } = node.attrs;

			return {
				html: buildFigureHtml(
					buildImgHtml(String(src), typeof alt === "string" ? alt : undefined),
					{ caption, inContent: true }
				),
			};
		},
	},
};

export const nestedRichTextResolver = new RichTextResolver(
	nestedRichTextSchema
);

/**
 * Mirrors the SDK's isRichTextEmpty, which renderRichText uses but
 * @storyblok/react doesn't export: rich text with no top-level node that has
 * content, a blok or a horizontal rule renders nothing.
 */
const isRichTextEmpty = (doc?: RichtextStoryblok): boolean =>
	!doc?.content?.some(
		(node) =>
			node.content || node.type === "blok" || node.type === "horizontal_rule"
	);

/**
 * Renders the nested rich text block's HTML, with captioned images as figures.
 *
 * Used instead of renderRichText, which checks for emptiness after any changes
 * to the document. A captioned image lifted out of its paragraph has no content,
 * so renderRichText would treat a block of only captioned images as empty and
 * render nothing. Here the check runs on the authored document, before images
 * are lifted, so empty blocks still render nothing as before.
 */
export const renderNestedRichText = (doc: RichtextStoryblok): string =>
	isRichTextEmpty(doc)
		? ""
		: nestedRichTextResolver.render(splitCaptionedImages(doc));
