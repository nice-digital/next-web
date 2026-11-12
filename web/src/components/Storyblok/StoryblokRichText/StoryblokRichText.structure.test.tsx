/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from "@testing-library/react";
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

	it("still wraps a multi-child paragraph (image plus text) in a <p>", () => {
		const multiChildDoc = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "image",
							attrs: {
								id: "123",
								alt: "Kitten wearing mittens",
								src: validSrc,
								title: "",
								source: "",
								copyright: "",
								meta_data: {},
							},
						},
						{
							type: "text",
							text: "Accompanying caption-like text in the same paragraph.",
						},
					],
				},
			],
		} as unknown as StoryblokRichtext;

		const { container } = render(<StoryblokRichText content={multiChildDoc} />);

		expect(container.querySelectorAll("p")).toHaveLength(1);
	});
});
