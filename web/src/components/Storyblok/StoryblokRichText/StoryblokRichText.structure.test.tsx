/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen } from "@testing-library/react";
import { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { type RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "./StoryblokRichText";

// Structure example tests for the NODE_IMAGE / NODE_PARAGRAPH resolvers.
//
// Covers:
//   - A single-image paragraph is unwrapped (no <p>) and the figure is present
//     (Requirement 1.3)
//   - A multi-child paragraph (image + text) is still wrapped in a <p>

const validSrc =
	"https://a.storyblok.com/f/243782/420x234/7a576133e7/example.png";

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

describe("StoryblokRichText - single-image paragraph unwrapping", () => {
	it("does not wrap a single-image paragraph in a <p>, and the figure is present", () => {
		const { container } = render(
			<StoryblokRichText
				content={buildImageDoc({ src: validSrc, alt: "An image" })}
			/>
		);

		expect(container.querySelectorAll("figure")).toHaveLength(1);
		expect(container.querySelectorAll("p")).toHaveLength(0);
	});

	it("still wraps a paragraph with no image in a <p>", () => {
		const textOnlyDoc = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ type: "text", text: "Just some text." }],
				},
			],
		} as unknown as StoryblokRichtext;

		const { container } = render(<StoryblokRichText content={textOnlyDoc} />);

		expect(container.querySelectorAll("p")).toHaveLength(1);
		expect(container.querySelectorAll("figure")).toHaveLength(0);
	});
});

describe("StoryblokRichText - images sharing a block with other content", () => {
	const imageNode = {
		type: "image",
		attrs: {
			id: "123",
			alt: "An image",
			src: validSrc,
			title: "A caption",
			source: "",
			copyright: "",
			meta_data: {},
		},
	};

	it("splits a paragraph around the image so the figure is not inside a <p>", () => {
		const mixedDoc = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{ type: "text", text: "Before the image." },
						imageNode,
						{ type: "text", text: "After the image." },
					],
				},
			],
		} as unknown as StoryblokRichtext;

		const { container } = render(<StoryblokRichText content={mixedDoc} />);

		// The figure is never nested in a paragraph
		expect(container.querySelectorAll("p figure")).toHaveLength(0);
		expect(container.querySelectorAll("figure")).toHaveLength(1);

		// Text before and after the image is kept, each in its own paragraph
		const wrapper = container.querySelector(
			'[data-testid="storyblok-rich-text"]'
		) as HTMLElement;
		expect(Array.from(wrapper.children).map((el) => el.tagName)).toEqual([
			"P",
			"FIGURE",
			"P",
		]);
		expect(wrapper.children[0]).toHaveTextContent("Before the image.");
		expect(wrapper.children[2]).toHaveTextContent("After the image.");

		// The caption stays with its image
		expect(wrapper.children[1].querySelector("figcaption")).toHaveTextContent(
			"A caption"
		);
	});

	it("does not render an empty <p> for a line break next to the image", () => {
		const breakDoc = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [imageNode, { type: "hard_break" }],
				},
			],
		} as unknown as StoryblokRichtext;

		const { container } = render(<StoryblokRichText content={breakDoc} />);

		expect(container.querySelectorAll("figure")).toHaveLength(1);
		expect(container.querySelectorAll("p")).toHaveLength(0);
	});

	it("splits a heading around the image so the figure and caption are not inside the heading", () => {
		const headingDoc = {
			type: "doc",
			content: [
				{
					type: "heading",
					attrs: { level: 2 },
					content: [imageNode, { type: "text", text: "Heading text" }],
				},
			],
		} as unknown as StoryblokRichtext;

		const { container } = render(<StoryblokRichText content={headingDoc} />);

		expect(container.querySelectorAll("h2 figure")).toHaveLength(0);
		expect(container.querySelectorAll("figure")).toHaveLength(1);

		// The figure comes first, followed by a heading holding only the text
		const wrapper = container.querySelector(
			'[data-testid="storyblok-rich-text"]'
		) as HTMLElement;
		expect(Array.from(wrapper.children).map((el) => el.tagName)).toEqual([
			"FIGURE",
			"H2",
		]);
		expect(wrapper.children[1]).toHaveTextContent("Heading text");
		expect(wrapper.children[1]).toHaveClass("sbRichtextHeading2");
		expect(wrapper.children[1]).not.toHaveTextContent("A caption");
	});

	it("still renders a heading with no image as a single heading", () => {
		const headingDoc = {
			type: "doc",
			content: [
				{
					type: "heading",
					attrs: { level: 3 },
					content: [{ type: "text", text: "Plain heading" }],
				},
			],
		} as unknown as StoryblokRichtext;

		render(<StoryblokRichText content={headingDoc} />);

		expect(
			screen.getByRole("heading", { level: 3, name: "Plain heading" })
		).toBeInTheDocument();
	});
});
