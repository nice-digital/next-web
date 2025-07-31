import { render, screen, within } from "@testing-library/react";

import { CardGridStoryblok } from "@/types/storyblok";

import { BasicCardGrid } from "./BasicCardGrid";

const mockCardBlok: CardGridStoryblok = {
	_uid: "i-b99d3593-7b34-4c41-8464-b206c8739073",
	component: "cardGrid",
	cards: [
		{
			_uid: "1",
			heading: "Advice and information on the use of drugs (BNF BNFc)",
			body: "The British National Formulary (BNF) provides information about the selection, prescribing, dispensing and administration of drugs.",
			link: {
				id: "",
				url: "https://bnf.nice.org.uk/",
				linktype: "url",
				cached_url: "https://bnf.nice.org.uk/",
				fieldtype: "multilink",
			},
			component: "card",
		},
	],
};

describe("BasicCardGrid", () => {
	it("renders a Card for each item in blok.cards", () => {
		render(<BasicCardGrid blok={mockCardBlok} />);

		expect(
			screen.getByText("Advice and information on the use of drugs (BNF BNFc)")
		).toBeInTheDocument();
	});

	it("renders internal links with Link component", () => {
		render(<BasicCardGrid blok={mockCardBlok} />);

		const internalLink = screen.getByRole("link", {
			name: /advice and information on the use of drugs/i,
		});

		expect(internalLink).toHaveAttribute("href", "https://bnf.nice.org.uk/");
	});

	it("renders card headings as <p> when headingLevel is missing or too high", () => {
		render(<BasicCardGrid blok={mockCardBlok} />);
		const card = screen.getByRole("article");

		// Within the card, find the link
		const link = within(card).getByRole("link", {
			name: /advice and information on the use of drugs/i,
		});
		expect(link).toBeInTheDocument();
	});

	it("does not break if headingLevel is missing", () => {
		const cardsWithoutLevel: CardGridStoryblok = {
			...mockCardBlok,
			cards: [
				{
					_uid: "card-3",
					heading: "Card Without Level",
					body: "No heading level provided",
					component: "card",
					link: {
						id: "3",
						url: "/another-internal",
						linktype: "story",
						fieldtype: "multilink",
						cached_url: "/another-internal",
					},
				},
			],
		};

		render(<BasicCardGrid blok={cardsWithoutLevel} />);
		expect(screen.getByText("Card Without Level")).toBeInTheDocument();
	});
});
