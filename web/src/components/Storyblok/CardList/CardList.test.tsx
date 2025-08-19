import { render, screen } from "@testing-library/react";

import { CardListSectionItemStoryblok } from "@/types/storyblok";

import { CardList, type CardListProps } from "./CardList";

const cardLinkUrl = "https://nice.org.uk/guidance/ta10";

const mockCardListProps: CardListProps = {
	blok: {
		cards: [
			{
				heading: "Mock card heading 1",
				body: "Mock card summary 1",
				link: {
					id: "",
					url: cardLinkUrl,
					linktype: "url",
					fieldtype: "multilink",
					cached_url: cardLinkUrl,
				},
				component: "cardListSectionItem",
				_uid: "123456877",
			},
		],
		component: "cardList",
		_uid: "1234578",
	},
};

describe("cardList component", () => {
	it("should render a heading, body text and link for nested card component with external link", () => {
		render(<CardList {...mockCardListProps} />);
		const cardHeading = screen.getByText("Mock card heading 1", {
			selector: "a",
		});
		const cardBody = screen.getByText("Mock card summary 1", {
			selector: "p",
		});
		expect(cardHeading).toBeInTheDocument();
		expect(cardHeading).toHaveAttribute("href", cardLinkUrl);
		expect(cardBody).toBeInTheDocument();
	});
	it("renders Card content heading level correctly", () => {
		const mockCardListWithHeadingLevelProps: CardListProps = {
			blok: {
				cards: [
					{
						heading: "Mock card heading 1",
						headingLevel: "3",
						body: "Mock card summary 1",
						link: {
							id: "",
							url: cardLinkUrl,
							linktype: "url",
							fieldtype: "multilink",
							cached_url: cardLinkUrl,
						},
						component: "cardListSectionItem",
						_uid: "123456877",
					},
				],
				component: "cardList",
				_uid: "1234578",
			},
		};
		render(<CardList {...mockCardListWithHeadingLevelProps} />);
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: "Mock card heading 1",
			})
		).toBeInTheDocument();
	});
	it("should render a heading, body text and link for nested card component with internal link", () => {
		const internalLink = {
			id: "",
			url: "",
			linktype: "story",
			fieldtype: "multilink",
			cached_url: "test-nick",
			story: {
				name: "Test Nick",
				id: 0,
				uuid: "",
				slug: "test-nick",
				url: "test-nick",
				full_slug: "test-nick",
				_stopResolving: true,
			},
		};
		const cards = [
			{ ...mockCardListProps.blok.cards[0], link: internalLink },
		] as CardListSectionItemStoryblok[];
		const mockCardListPropsInternalLink: CardListProps = {
			blok: {
				...mockCardListProps.blok,
				headingLevel: "3",
				cards: cards,
			},
		};
		render(<CardList {...mockCardListPropsInternalLink} />);
		const cardHeading = screen.getByText("Mock card heading 1", {
			selector: "a",
		});
		const cardBody = screen.getByText("Mock card summary 1", {
			selector: "p",
		});
		expect(cardHeading).toBeInTheDocument();
		expect(cardHeading).toHaveAttribute("href", "/test-nick");
		expect(cardBody).toBeInTheDocument();
	});
});
