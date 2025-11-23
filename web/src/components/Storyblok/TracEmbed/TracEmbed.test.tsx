import { render, screen } from "@testing-library/react";

import { QuoteStoryblok } from "@/types/storyblok";

import { TracEmbed } from "./TracEmbed";

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

xdescribe("TracEmbed", () => {
	it("should render the quote ", () => {
		render(<TracEmbed />);

		expect(screen.getByText("Test quote text")).toBeInTheDocument();
	});

	it("should render the quote author", () => {
		render(<TracEmbed />);

		expect(screen.getByText("Test quote author")).toBeInTheDocument();
	});
});
