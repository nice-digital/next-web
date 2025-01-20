import { render, screen } from "@testing-library/react";

import { CardListSection, type CardListSectionProps } from "./CardListSection";

const leadTextContent = "Mock cardListSection lead text";
const cardLinkUrl = "https://nice.org.uk/guidance/ta10";

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
							text: leadTextContent,
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
					url: cardLinkUrl,
					linktype: "url",
					fieldtype: "multilink",
					cached_url: cardLinkUrl,
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
		const propsWithTransparentLargePadding: CardListSectionProps = {
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

	it("should match snapshot when card section list intro is not present", () => {
		const mockCardListSectionPropsNoIntro = {
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
		const { container } = render(
			<CardListSection {...mockCardListSectionPropsNoIntro} />
		);
		expect(container).toMatchSnapshot();
	});

	it("should hide heading/title section when not provided", () => {
		const mockCardListSectionPropsNoHeading = {
			blok: {
				...mockCardListSectionProps.blok,
				heading: " ",
			},
		};
		render(<CardListSection {...mockCardListSectionPropsNoHeading} />);
		const heading = screen.queryByRole("heading", {
			name: mockCardListSectionPropsNoHeading.blok.heading,
		});
		expect(heading).not.toBeInTheDocument();
	});

	it("should hide lead text section when not provided", () => {
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
		const richText = screen.queryByText(leadTextContent);
		expect(richText).not.toBeInTheDocument();
	});

	it("should render heading as h3 when headingLevel has been selected as 3", () => {
		const mockCardListSectionPropsHeading3: CardListSectionProps = {
			blok: {
				...mockCardListSectionProps.blok,
				headingLevel: "3",
			},
		};
		render(<CardListSection {...mockCardListSectionPropsHeading3} />);
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: mockCardListSectionPropsHeading3.blok.heading,
			})
		).toBeInTheDocument();
	});

	it("should render a heading, body text and link for nested card component", () => {
		render(<CardListSection {...mockCardListSectionProps} />);
		const cardHeading = screen.getByText("Mock card heading 1", {
			selector: "a",
		});
		const cardBody = screen.getByText("Mock card summary 1", {
			selector: "li",
		});
		expect(cardHeading).toBeInTheDocument();
		expect(cardHeading).toHaveAttribute("href", cardLinkUrl);
		expect(cardBody).toBeInTheDocument();
	});
});
