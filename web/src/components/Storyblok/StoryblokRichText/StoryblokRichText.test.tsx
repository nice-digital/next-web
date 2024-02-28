import { render, screen } from "@testing-library/react";
import { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { mockRichText } from "@/test-utils/storyblok-data";

import { StoryblokRichText } from "./StoryblokRichText";
// Define the node types

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
