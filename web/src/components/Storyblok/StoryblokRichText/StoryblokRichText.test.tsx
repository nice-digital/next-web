/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { publicRuntimeConfig } from "@/config";
import { mockRichText } from "@/test-utils/storyblok-data";
import { type RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "./StoryblokRichText";
// Define the node types

// The caption flag lives on publicRuntimeConfig.storyblok.enableRichTextImageCaptions.
// Mock @/config with a mutable config object so the flag can be toggled per test
// (the snapshot tests below need to exercise both the flag-off and flag-on
// states). This mirrors the pattern in the sibling caption/property tests. The
// flag defaults to "false", matching the real yml default, so the existing
// assertions in this file are unaffected.
jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		publicBaseURL: "https://www.example.com",
		storyblok: {
			enableRichTextImageCaptions: "false",
		},
	},
}));

type Writable<T> = {
	-readonly [K in keyof T]: Writable<T[K]>;
};

const mutableConfig = publicRuntimeConfig as Writable<
	typeof publicRuntimeConfig
>;

const mockRichTextDataEmptyParagraph: StoryblokRichtext = {
	type: "doc",
	content: [
		{
			type: "paragraph",
		},
	],
};

/**
 * Builds a valid Storyblok richtext doc containing a single paragraph whose only
 * child is an image node carrying the supplied attrs. Used by the snapshot tests
 * to exercise the figure wrapping (flag off) and caption rendering (flag on).
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

describe("StoryblokRichText", () => {
	beforeEach(() => {
		// Default the caption flag to off before each test, matching the real
		// yml default; snapshot tests opt in to the enabled state as needed.
		mutableConfig.storyblok.enableRichTextImageCaptions = "false";
	});

	it("should render correctly", () => {
		render(<StoryblokRichText content={mockRichText} />);
		const component = screen.getByTestId("storyblok-rich-text");
		expect(component).toBeInTheDocument();

		const textElement = screen.getByText(/Example text content./i);
		expect(textElement).toBeInTheDocument();
	});

	it("should render heading levels h2 to h6", () => {
		render(<StoryblokRichText content={mockRichText} />);
		const h2Element = screen.getByRole("heading", { level: 2 });
		expect(h2Element).toBeInTheDocument();
		const h3Element = screen.getByRole("heading", { level: 3 });
		expect(h3Element).toBeInTheDocument();
		const h4Element = screen.getByRole("heading", { level: 4 });
		expect(h4Element).toBeInTheDocument();
		const h5Element = screen.getByRole("heading", { level: 5 });
		expect(h5Element).toBeInTheDocument();
		const h6Element = screen.getByRole("heading", { level: 6 });
		expect(h6Element).toBeInTheDocument();
	});

	it("should render an image using the StoryblokImage component", () => {
		render(<StoryblokRichText content={mockRichText} />);
		const imageElement = screen.getByRole("img");
		expect(imageElement).toBeInTheDocument();
	});

	it("should render a blockquote", () => {
		render(<StoryblokRichText content={mockRichText} />);
		// The rich-text image is now wrapped in its own <figure>, so target the
		// blockquote figure specifically via its quote class rather than assuming
		// a single figure in the document.
		const blockquoteElement = screen
			.getAllByRole("figure")
			.find((figure) => figure.classList.contains("quote"));

		expect(blockquoteElement).toBeInTheDocument();
		expect(blockquoteElement).toHaveClass("quote");
	});

	it("shouldn't render a p tag that has no content", () => {
		render(<StoryblokRichText content={mockRichTextDataEmptyParagraph} />);
		const component = screen.getByTestId("storyblok-rich-text");

		expect(component).toBeEmptyDOMElement();
	});

	describe("image figure/figcaption snapshots", () => {
		// Snapshot: a single rich-text image is wrapped in a <figure> and, with the
		// caption flag OFF, renders no <figcaption> (Requirement 1.1).
		it("wraps a single image in a figure with no figcaption when the flag is off", () => {
			mutableConfig.storyblok.enableRichTextImageCaptions = "false";

			const { container } = render(
				<StoryblokRichText
					content={buildImageDoc({
						src: validSrc,
						alt: "An image",
						title: "A caption that should not show",
					})}
				/>
			);

			expect(container.firstChild).toMatchSnapshot();
		});

		// Snapshot: with the caption flag ON and a non-empty title, the image renders
		// inside a <figure> followed by a <figcaption> carrying the caption text
		// (Requirements 1.1, 2.1).
		it("renders a figcaption after the image when the flag is on and the title is non-empty", () => {
			mutableConfig.storyblok.enableRichTextImageCaptions = "true";

			const { container } = render(
				<StoryblokRichText
					content={buildImageDoc({
						src: validSrc,
						alt: "An image",
						title: "A descriptive caption",
					})}
				/>
			);

			expect(container.firstChild).toMatchSnapshot();
		});
	});
});
