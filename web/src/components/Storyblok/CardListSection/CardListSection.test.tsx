import { render, screen } from "@testing-library/react";

import { CardListSection, type CardListSectionProps } from "./CardListSection";
import { fieldHasValidContent } from "@/utils/storyblok";

const mockCardListSectionProps: CardListSectionProps = {
	blok: {
		heading: "Mock cardListSection title",
		headingLevel: "2",
		leadText: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: "Mock cardListSection lead text",
						},
					],
				},
			],
		},
		verticalPadding: "medium",
		theme: "subtle",
		cards: [
			{
				heading: "Mock card heading 1",
				body: "Mock card summary 1",
				link: {
					id: "",
					url: "https://nice.org.uk/guidance/ta10",
					linktype: "url",
					fieldtype: "multilink",
					cached_url: "https://nice.org.uk/guidance/ta10",
				},
				component: "cardListSectionItem",
				_uid: "123456877",
			},
		],
		component: "cardListSection",
		_uid: "1234578",
	},
};

describe("cardListSection component", () => {
	it("should match snapshot with default values", () => {
		const { container } = render(
			<CardListSection {...mockCardListSectionProps} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot with transparent theme and large padding", () => {
		let propsWithTransparentLargePadding: CardListSectionProps = {
			blok: {
				...mockCardListSectionProps.blok,
				verticalPadding: "large",
				theme: "transparent",
			},
		};

		const { container } = render(
			<CardListSection {...propsWithTransparentLargePadding} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should hide heading/title section when not provided", async () => {
		const mockCardListSectionPropsNoHeading = {
			blok: {
				...mockCardListSectionProps.blok,
				heading: " ",
			},
		};
		render(<CardListSection {...mockCardListSectionPropsNoHeading} />);
		const noHeading = await screen.queryAllByRole("heading", {
			name: mockCardListSectionPropsNoHeading.blok.heading,
		});
		expect(noHeading.length).toBe(0);
	});

	it("should hide lead text section when not provided", async () => {
		const mockCardListSectionPropsNoLeadText = {
			blok: {
				...mockCardListSectionProps.blok,
				leadText: {
					type: "doc",
					content: [
						{
							type: "paragraph",
						},
					],
				},
			},
		};
		render(<CardListSection {...mockCardListSectionPropsNoLeadText} />);
		const richTextHasContent = fieldHasValidContent(
			mockCardListSectionPropsNoLeadText.blok.leadText
		);
		expect(richTextHasContent).toBe(false);
	});

	it("should hide heading/title and leadText section when not provided", async () => {
		const mockCardListSectionPropsNoHeading = {
			blok: {
				...mockCardListSectionProps.blok,
				heading: "",
				leadText: {
					type: "doc",
					content: [
						{
							type: "paragraph",
						},
					],
				},
			},
		};
		render(<CardListSection {...mockCardListSectionPropsNoHeading} />);
		const noHeading = await screen.queryAllByRole("heading", {
			name: mockCardListSectionPropsNoHeading.blok.heading,
		});
		expect(noHeading.length).toBe(0);
		const richTextHasContent = fieldHasValidContent(
			mockCardListSectionPropsNoHeading.blok.leadText
		);
		expect(richTextHasContent).toBe(false);
		const noDivElement = await screen.queryByRole("div");
		expect(noDivElement).not.toBeInTheDocument();
	});
	// it("should render heading as h3 when headingLevel has been selected as 3", () => {
	//         const box: PromoBoxProps = {
	//             ...mockPromoBox,
	//             headingLevel: 5,
	//         };

	//         render(<PromoBox {...box} />);
	//         expect(
	//             screen.getByRole("heading", { level: 5, name: "Mock promo box title" })
	//         ).toBeInTheDocument();
	//     });
	// });
});
