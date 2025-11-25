import { render, screen } from "@testing-library/react";

import { QuoteStoryblok } from "@/types/storyblok";

import { Blockquote } from "./FormEmbed";

const mockBlockquote: QuoteStoryblok = {
	quoteText: {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						text: "Test quote text",
					},
				],
			},
		],
	},
	quoteAuthor: "Test quote author",
	_uid: "123",
	component: "quote",
} as QuoteStoryblok;

xdescribe("Blockquote", () => {
	it("should render the quote ", () => {
		render(<Blockquote blok={mockBlockquote} />);

		expect(screen.getByText("Test quote text")).toBeInTheDocument();
	});

	it("should render the quote author", () => {
		render(<Blockquote blok={mockBlockquote} />);

		expect(screen.getByText("Test quote author")).toBeInTheDocument();
	});
});
