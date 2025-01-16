import { render, screen } from "@testing-library/react";

import { CardListSection, type CardListSectionProps } from "./CardListSection";

const mockCardListSectionProps: CardListSectionProps = {
	blok: {
		heading: "Mock promo box title",
		leadText: {
			type: "Mock rich text",
		},
		headingLevel: "2",
		verticalPadding: "medium",
		theme: "subtle",
		cards: [
			{
				heading: "card heading",
				body: " card summary",
				link: {
                    id: "",
                    url: "https://nice.org.uk/guidance/ta10",
                    linktype: "url",
                    fieldtype: "multilink",
                    cached_url: "https://nice.org.uk/guidance/ta10",
                },
				component: "cardListSectionItem",
				_uid: "123456877"
			},
		],
		component: "cardListSection",
        _uid: "1234578",
	},
};
describe("Promo box component", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<CardListSection {...mockCardListSectionProps} />
		);
		expect(container).toMatchSnapshot();
	});
});
