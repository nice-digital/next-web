import { render, screen } from "@testing-library/react";
import { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { StoryblokRichText } from "./StoryblokRichText";
// Define the node types

const mockRichTextData: StoryblokRichtext = {
	type: "doc",
	content: [
		{
			type: "heading",
			attrs: {
				level: 2,
			},
			content: [
				{
					text: "A mock h2 heading in a news article rich text field",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 3,
			},
			content: [
				{
					text: "A mock h3 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 4,
			},
			content: [
				{
					text: "A mock h4 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 5,
			},
			content: [
				{
					text: "A mock h5 heading",
					type: "text",
				},
			],
		},
		{
			type: "heading",
			attrs: {
				level: 6,
			},
			content: [
				{
					text: "A mock h6 heading",
					type: "text",
				},
			],
		},
		{
			type: "paragraph",
			content: [
				{
					type: "text",
					text: "Example text content.",
				},
			],
		},
		{
			type: "paragraph",
			content: [
				{
					type: "image",
					attrs: {
						id: "13894387",
						alt: "doctor showing results on a tablet computer to a male patient",
						src: "https://a.storyblok.com/f/271255/788x443/b2d6d3a601/doctor-showing-results-on-tablet-computer-to-male-patient.jpg",
						title: "",
						source: "",
						copyright: "",
						meta_data: {},
					},
				},
			],
		},
		{
			type: "blockquote",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "A inline quote in the rich text field of a news article. ",
							type: "text",
						},
					],
				},
			],
		},
	],
};

const mockRichTextDataEmptyParagraph: StoryblokRichtext = {
	type: "doc",
	content: [
		{
			type: "paragraph",
		},
	],
};

describe("StoryblokRichText", () => {
	it("should render correctly", () => {
		render(<StoryblokRichText content={mockRichTextData} />);
		const component = screen.getByTestId("storyblok-rich-text");
		expect(component).toBeInTheDocument();

		const textElement = screen.getByText(/Example text content./i);
		expect(textElement).toBeInTheDocument();
	});

	it("should render heading levels h2 to h6", () => {
		render(<StoryblokRichText content={mockRichTextData} />);
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
		render(<StoryblokRichText content={mockRichTextData} />);
		const imageElement = screen.getByRole("img");
		expect(imageElement).toBeInTheDocument();
	});

	it("should render a blockquote", () => {
		render(<StoryblokRichText content={mockRichTextData} />);
		const blockquoteElement = screen.getByRole("figure");

		expect(blockquoteElement).toBeInTheDocument();
		expect(blockquoteElement).toHaveClass("quote");
	});

	it("shouldn't render a p tag that has no content", () => {
		render(<StoryblokRichText content={mockRichTextDataEmptyParagraph} />);
		const component = screen.getByTestId("storyblok-rich-text");

		expect(component).toBeEmptyDOMElement();
	});
});
