/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from "@testing-library/react";

import { type RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "./StoryblokRichText";

// Example and edge-case unit tests for StoryblokRichText rich-text image captions.
//
// Captions are always rendered from the image `title` field when the
// trimmed title is non-empty; there is no config flag gating this behaviour.
//
// Covers:
//   - Figure wrapping present for a single rich-text image (Requirement 1.1)
//   - Caption rendered from the `title` field (Requirements 2.1, 2.2)
//   - Empty/whitespace caption omitted (Requirement 2.3)
//   - Fallback dimensions 16/9 when `src` is missing (Requirement 1.4)

/**
 * Builds a valid Storyblok richtext doc containing a single paragraph whose only
 * child is an image node. `src`/`alt`/`title` are optional so edge cases (a
 * missing source, an absent caption) can be exercised.
 */
const buildImageDoc = (attrs: {
	src?: string;
	alt?: string;
	title?: string;
}): RichtextStoryblok => ({
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [
				{
					type: "image",
					attrs: {
						id: "123",
						source: "",
						copyright: "",
						meta_data: {},
						...attrs,
					},
				},
			],
		},
	],
});

// A concrete, valid Storyblok-shaped URL whose 6th path segment (index 5) carries
// the `{width}x{height}` dimensions block the NODE_IMAGE resolver splits on.
const validSrc =
	"https://a.storyblok.com/f/243782/420x234/7a576133e7/example.png";

describe("StoryblokRichText - image captions (examples and edge cases)", () => {
	// Requirement 1.1: each rich-text image is wrapped in exactly one figure with
	// the rendered image as its single media child.
	it("wraps a single rich-text image in exactly one figure containing one image", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({ src: validSrc, alt: "An image" })}
			/>
		);

		const figures = container.querySelectorAll("figure");
		expect(figures).toHaveLength(1);

		const figure = figures[0];
		expect(figure.querySelectorAll("img")).toHaveLength(1);

		// The figure is the outermost rendered element - it sits directly inside
		// the component wrapper and is not nested in a <p>.
		const wrapper = container.querySelector(
			'[data-testid="storyblok-rich-text"]'
		);
		expect(figure.parentElement).toBe(wrapper);
	});

	// Requirements 2.1, 2.2: the caption is rendered from the `title` field in a
	// single figcaption after the image, character-for-character identical to the
	// (trimmed) title value.
	it("renders the caption from the title field", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({
					src: validSrc,
					alt: "An image",
					title: "A descriptive caption",
				})}
			/>
		);

		const figure = container.querySelector("figure");
		expect(figure).not.toBeNull();

		const image = (figure as HTMLElement).querySelector("img");
		expect(image).not.toBeNull();

		const figcaptions = (figure as HTMLElement).querySelectorAll("figcaption");
		expect(figcaptions).toHaveLength(1);

		const figcaption = figcaptions[0];

		// Text content is identical to the title value.
		expect(figcaption.textContent).toBe("A descriptive caption");

		// The figcaption follows the image in DOM order.
		expect(
			(image as HTMLElement).compareDocumentPosition(figcaption) &
				Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
	});

	// Requirements 2.2: leading/trailing whitespace is trimmed from the caption.
	it("trims leading and trailing whitespace from the caption", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({
					src: validSrc,
					alt: "An image",
					title: "   padded caption   ",
				})}
			/>
		);

		const figcaption = container.querySelector("figcaption");
		expect(figcaption).not.toBeNull();
		expect(figcaption?.textContent).toBe("padded caption");
	});

	// Requirement 2.3: an empty caption is omitted.
	it("omits the figcaption for an empty caption", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({ src: validSrc, alt: "An image", title: "" })}
			/>
		);

		const figure = container.querySelector("figure");
		expect(figure).not.toBeNull();
		expect(figure?.querySelectorAll("img")).toHaveLength(1);
		expect(figure?.querySelectorAll("figcaption")).toHaveLength(0);
	});

	// Requirement 2.3: a whitespace-only caption is omitted.
	it("omits the figcaption for a whitespace-only caption", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({
					src: validSrc,
					alt: "An image",
					title: "   \t\n  ",
				})}
			/>
		);

		const figure = container.querySelector("figure");
		expect(figure).not.toBeNull();
		expect(figure?.querySelectorAll("figcaption")).toHaveLength(0);
	});

	// Requirement 1.4: when the image has no source, the StoryblokImage is rendered
	// with fallback dimensions of width 16 / height 9 (aspect ratio 16/9).
	it("renders fallback 16/9 dimensions when the image src is missing", () => {
		const { container } = render(
			<StoryblokRichText content={buildImageDoc({ alt: "An image" })} />
		);

		const figure = container.querySelector("figure");
		expect(figure).not.toBeNull();

		const image = (figure as HTMLElement).querySelector("img");
		expect(image).not.toBeNull();

		expect(image).toHaveAttribute("width", "16");
		expect(image).toHaveAttribute("height", "9");
		expect(image?.style.aspectRatio).toBe("16/9");
	});
});
