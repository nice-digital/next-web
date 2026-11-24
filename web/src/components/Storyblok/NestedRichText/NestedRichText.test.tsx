/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
// Plain <img> is intentional: it matches the HTML the block renders
/* eslint-disable @next/next/no-img-element */
import { RichTextResolver } from "@storyblok/react";
import { render } from "@testing-library/react";

import { Figure } from "@/components/Storyblok/Figure/Figure";
import {
	type NestedRichTextStoryblok,
	type RichtextStoryblok,
} from "@/types/storyblok";

import { nestedRichTextResolver } from "./captionedImages";
import { NestedRichText } from "./NestedRichText";

const src = "https://a.storyblok.com/f/243782/420x234/7a576133e7/example.png";

const text = (value: string): RichtextStoryblok => ({
	type: "text",
	text: value,
});

const image = (attrs: Record<string, unknown> = {}): RichtextStoryblok => ({
	type: "image",
	attrs: {
		id: "1",
		src,
		alt: "An image",
		title: "A caption",
		source: "",
		copyright: "",
		meta_data: {},
		...attrs,
	},
});

const paragraph = (...content: RichtextStoryblok[]): RichtextStoryblok => ({
	type: "paragraph",
	content,
});

const mountBlock = (...content: RichtextStoryblok[]) => {
	const blok = {
		component: "nestedRichText",
		_uid: "1",
		richText: { type: "doc", content },
	} as NestedRichTextStoryblok;

	const { container } = render(<NestedRichText blok={blok} />);

	return container.querySelector(".nested-rich-text") as HTMLElement;
};

const tagNames = (element: Element): string[] =>
	Array.from(element.children).map((child) => child.tagName);

describe("NestedRichText image captions", () => {
	describe("images without a caption", () => {
		it.each([
			["an empty title", ""],
			["a whitespace-only title", "   \t "],
		])("renders the default markup for an image with %s", (_label, title) => {
			const block = mountBlock(paragraph(image({ title })));

			expect(block.querySelectorAll("figure")).toHaveLength(0);
			expect(block.querySelectorAll("figcaption")).toHaveLength(0);
			expect(block.querySelectorAll("p > img")).toHaveLength(1);
		});

		it("renders the default markup for an image with no title", () => {
			const block = mountBlock(paragraph(image({ title: undefined })));

			expect(block.querySelectorAll("figure")).toHaveLength(0);
			expect(block.querySelectorAll("p > img")).toHaveLength(1);
		});

		it("does not turn an image with no source into a figure", () => {
			const block = mountBlock(paragraph(image({ src: undefined })));

			expect(block.querySelectorAll("figure")).toHaveLength(0);
			expect(block.querySelectorAll("figcaption")).toHaveLength(0);
		});
	});

	describe("images with a caption", () => {
		it("renders a figure with the image and caption, not wrapped in a paragraph", () => {
			const block = mountBlock(paragraph(image()));

			expect(tagNames(block)).toEqual(["FIGURE"]);
			expect(block.querySelectorAll("p")).toHaveLength(0);

			const figure = block.querySelector("figure") as HTMLElement;
			const img = figure.querySelector("img") as HTMLImageElement;

			expect(img).toHaveAttribute("src", src);
			expect(img).toHaveAttribute("alt", "An image");
			// The caption replaces the title, so it isn't repeated as a tooltip
			expect(img).not.toHaveAttribute("title");
			expect(figure.querySelectorAll("figcaption")).toHaveLength(1);
			expect(figure.querySelector("figcaption")).toHaveTextContent("A caption");
		});

		it("places the caption after the image", () => {
			const block = mountBlock(paragraph(image()));

			expect(tagNames(block.querySelector("figure") as Element)).toEqual([
				"IMG",
				"FIGCAPTION",
			]);
		});

		it("trims the caption", () => {
			const block = mountBlock(paragraph(image({ title: "  padded  " })));

			expect(block.querySelector("figcaption")?.textContent).toBe("padded");
		});

		it("uses the same markup, classes and spacing as a rich text figure", () => {
			const block = mountBlock(paragraph(image()));
			const { container } = render(
				<Figure caption="A caption" inContent>
					<img src={src} alt="An image" />
				</Figure>
			);

			expect(block.querySelector("figure")?.outerHTML).toBe(
				container.querySelector("figure")?.outerHTML
			);
		});

		it("keeps each caption with its own image when there are several", () => {
			const block = mountBlock(
				paragraph(image({ alt: "First", title: "First caption" })),
				paragraph(image({ alt: "Second", title: "Second caption" }))
			);

			const figures = Array.from(block.querySelectorAll("figure"));

			expect(figures).toHaveLength(2);
			expect(figures[0].querySelector("img")).toHaveAttribute("alt", "First");
			expect(figures[0].querySelector("figcaption")).toHaveTextContent(
				"First caption"
			);
			expect(figures[1].querySelector("img")).toHaveAttribute("alt", "Second");
			expect(figures[1].querySelector("figcaption")).toHaveTextContent(
				"Second caption"
			);
		});

		it("escapes HTML in the caption and alt text", () => {
			const caption = `<script>alert(1)</script> & "quoted"`;
			const block = mountBlock(
				paragraph(image({ title: caption, alt: `"><b>bold</b>` }))
			);

			expect(block.querySelectorAll("script")).toHaveLength(0);
			expect(block.querySelectorAll("b")).toHaveLength(0);
			expect(block.querySelector("figcaption")?.textContent).toBe(caption);
			expect(block.querySelector("img")).toHaveAttribute(
				"alt",
				`"><b>bold</b>`
			);
		});
	});

	describe("images sharing a block with other content", () => {
		it("splits a paragraph around the image so the figure is not inside a <p>", () => {
			const block = mountBlock(
				paragraph(text("Before the image."), image(), text("After the image."))
			);

			expect(block.querySelectorAll("p figure")).toHaveLength(0);
			expect(tagNames(block)).toEqual(["P", "FIGURE", "P"]);
			expect(block.children[0]).toHaveTextContent("Before the image.");
			expect(block.children[1].querySelector("figcaption")).toHaveTextContent(
				"A caption"
			);
			expect(block.children[2]).toHaveTextContent("After the image.");
		});

		it("does not render an empty paragraph for a line break next to the image", () => {
			const block = mountBlock(paragraph(image(), { type: "hard_break" }));

			expect(tagNames(block)).toEqual(["FIGURE"]);
		});

		it("splits a heading around the image so the figure and caption are not inside the heading", () => {
			const block = mountBlock({
				type: "heading",
				attrs: { level: 2 },
				content: [image(), text("Heading text")],
			});

			expect(block.querySelectorAll("h2 figure")).toHaveLength(0);
			expect(tagNames(block)).toEqual(["FIGURE", "H2"]);
			expect(block.children[1]).toHaveTextContent("Heading text");
			expect(block.children[1]).not.toHaveTextContent("A caption");
		});

		it("keeps a heading with no image as a single heading", () => {
			const block = mountBlock({
				type: "heading",
				attrs: { level: 3 },
				content: [text("Plain heading")],
			});

			expect(tagNames(block)).toEqual(["H3"]);
		});

		it("splits a paragraph inside a list item", () => {
			const block = mountBlock({
				type: "bullet_list",
				content: [
					{
						type: "list_item",
						content: [paragraph(text("Item"), image())],
					},
				],
			});

			expect(block.querySelectorAll("p figure")).toHaveLength(0);
			expect(tagNames(block.querySelector("li") as Element)).toEqual([
				"P",
				"FIGURE",
			]);
		});

		it("leaves an uncaptioned image inline in its paragraph", () => {
			const block = mountBlock(
				paragraph(text("Text "), image({ title: "" }), text(" more text"))
			);

			expect(tagNames(block)).toEqual(["P"]);
			expect(block.querySelectorAll("p > img")).toHaveLength(1);
		});
	});

	it("renders existing content other than images as before", () => {
		const block = mountBlock(
			{ type: "heading", attrs: { level: 2 }, content: [text("Heading")] },
			paragraph(text("Some "), {
				type: "text",
				text: "bold",
				marks: [{ type: "bold" }],
			})
		);

		expect(block.innerHTML).toBe("<h2>Heading</h2><p>Some <b>bold</b></p>");
	});

	it("renders content without captioned images exactly as the default resolver does", () => {
		const link = {
			type: "link",
			attrs: {
				href: "https://www.example.com",
				target: "_self",
				linktype: "url",
				uuid: null,
				anchor: null,
			},
		};
		const doc: RichtextStoryblok = {
			type: "doc",
			content: [
				{ type: "heading", attrs: { level: 2 }, content: [text("Heading")] },
				{ type: "heading", attrs: { level: 4 }, content: [text("Sub")] },
				paragraph(
					text("Plain "),
					{ type: "text", text: "bold", marks: [{ type: "bold" }] },
					{ type: "text", text: " italic", marks: [{ type: "italic" }] },
					{ type: "text", text: " a link", marks: [link] },
					{ type: "hard_break" },
					text("after a break")
				),
				paragraph(text("Inline "), image({ title: "" }), text(" image")),
				paragraph(image({ title: "Has a title but no source", src: "" })),
				{
					type: "bullet_list",
					content: [{ type: "list_item", content: [paragraph(text("One"))] }],
				},
				{
					type: "ordered_list",
					attrs: { order: 1 },
					content: [{ type: "list_item", content: [paragraph(text("Two"))] }],
				},
				{ type: "blockquote", content: [paragraph(text("Quote"))] },
				{ type: "horizontal_rule" },
				paragraph(),
			],
		};

		expect(nestedRichTextResolver.render(doc, {}, false)).toBe(
			new RichTextResolver().render(doc, {}, false)
		);
	});

	it("renders a block containing only captioned images", () => {
		const block = mountBlock(
			paragraph(image({ alt: "First" })),
			paragraph(image({ alt: "Second" }))
		);

		expect(tagNames(block)).toEqual(["FIGURE", "FIGURE"]);
	});

	it("renders nothing for a block of empty paragraphs, as before", () => {
		// Storyblok's empty paragraphs have no content key
		const block = mountBlock({ type: "paragraph" }, { type: "paragraph" });

		expect(block).toBeEmptyDOMElement();
	});

	it("renders nothing for empty content without throwing", () => {
		const { container } = render(
			<NestedRichText
				blok={
					{
						component: "nestedRichText",
						_uid: "1",
						richText: { type: "doc" },
					} as NestedRichTextStoryblok
				}
			/>
		);

		expect(container.querySelector(".nested-rich-text")).toBeEmptyDOMElement();
	});
});
