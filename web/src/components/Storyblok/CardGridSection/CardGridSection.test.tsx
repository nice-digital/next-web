import { render, screen } from "@testing-library/react";

import {
	type TestimonialGridItemStoryblok,
	type CalloutCardStoryblok,
	type CalloutCardWithImageStoryblok,
	type CardStoryblok,
	type CardGridSectionStoryblok,
	type RichtextStoryblok,
} from "@/types/storyblok";
import { type StoryblokCalloutCardProps } from "../StoryblokCalloutCard/StoryblokCalloutCard";

import { resolveStoryblokLink } from "@/utils/storyblok";
import { CardGridSection, CardGridSectionProps } from "./CardGridSection";

jest.mock("@/utils/storyblok", () => ({
	resolveStoryblokLink: jest.fn(),
	fieldHasValidContent: jest.fn(() => true),
	constructStoryblokImageSrc: jest.fn((filename) => filename),
}));

const mockLeadText: RichtextStoryblok = {
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [
				{
					type: "text",
					text: "This is lead text.",
				},
			],
		},
	],
};

const cardLinkUrl = "https://nice.org.uk/guidance/ta10";

const mockCardProps = {
	blok: {
		component: "card",
		_uid: "1",
		heading: "Mock card title",
		body: "Mock card summary",
		link: {
			fieldtype: "multilink",
			id: "link1",
			url: cardLinkUrl,
			cached_url: cardLinkUrl,
			linktype: "url",
		},
	} as CardStoryblok,
};

const mockCalloutCardProps: StoryblokCalloutCardProps = {
	blok: {
		...mockCardProps.blok,
		component: "calloutCard",
	} as CalloutCardStoryblok,
};

const mockCalloutCardWithImageProps = {
	blok: {
		...mockCalloutCardProps.blok,
		image: {
			id: 18214711,
			alt: "",
			name: "",
			focus: "",
			title: "",
			source: "",
			filename: "test.JPG",
			copyright: "",
			fieldtype: "asset",
			meta_data: {},
			is_external_url: false,
		},
		component: "calloutCardWithImage",
	} as CalloutCardWithImageStoryblok,
};

describe("CardGridSection", () => {
	beforeEach(() => {
		(resolveStoryblokLink as jest.Mock).mockImplementation((link) => ({
			url: link?.url || link?.cached_url,
			isInternal:
				(link?.url?.startsWith("/") || link?.cached_url?.startsWith("/")) ??
				false,
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const mockProps: CardGridSectionProps = {
		blok: {
			component: "cardGridSection",
			_uid: "section1",
			heading: "Card Grid Section Heading",
			headingLevel: "2",
			leadText: mockLeadText,
			theme: "transparent",
			verticalPadding: "small",
			cards: [
				{
					component: "cardGridRowBasic",
					columns: "3",
					gridItems: [
						{
							...mockCardProps.blok,
						},
						{
							...mockCardProps.blok,
						},
						{
							...mockCardProps.blok,
						},
						{
							...mockCardProps.blok,
						},
					] as CardStoryblok[],
					_uid: "row1",
				},
			],
		} as CardGridSectionStoryblok,
	};

	it("renders without crashing", () => {
		render(<CardGridSection {...mockProps} />);
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"Card Grid Section Heading"
		);
	});

	it("renders lead text correctly", () => {
		render(<CardGridSection {...mockProps} />);
		const leadTextElement = screen.getByTestId("storyblok-rich-text");
		expect(leadTextElement).toBeInTheDocument();
		expect(leadTextElement).toHaveTextContent("This is lead text.");
	});

	it("applies correct theme class", () => {
		render(<CardGridSection {...mockProps} />);
		const section = screen.getByTestId("card-grid-section");
		expect(section).toHaveClass("cardGridSection--transparent");
	});

	it("renders the correct grid structure", () => {
		render(<CardGridSection {...mockProps} />);
		const grid = screen
			.getByTestId("card-grid-section")
			// eslint-disable-next-line testing-library/no-node-access
			.querySelector("div.grid, ul.grid");
		expect(grid).toBeInTheDocument();
	});

	it("resolves links correctly", () => {
		render(<CardGridSection {...mockProps} />);
		const linkElement = screen.getAllByRole("link", {
			name: "Mock card title",
		});
		expect(linkElement[0]).toBeInTheDocument();
		expect(linkElement[0]).toHaveAttribute("href", cardLinkUrl);
	});

	it("renders Card content correctly", () => {
		render(<CardGridSection {...mockProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const card = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(4);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(card.length).toBe(4);
	});

	it("renders Callout Card content correctly", () => {
		const mockCalloutProps: CardGridSectionProps = {
			blok: {
				...mockProps.blok,
				cards: [
					{
						component: "cardGridRowCallout",
						columns: "3",
						gridItems: [
							{
								...mockCalloutCardProps.blok,
							},
							{
								...mockCalloutCardProps.blok,
							},
							{
								...mockCalloutCardProps.blok,
							},
						] as CalloutCardStoryblok[],
						_uid: "row1",
					},
				],
			},
		};
		render(<CardGridSection {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(3);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(3);
	});

	it("renders Callout Card With Image content correctly", () => {
		const mockCalloutProps: CardGridSectionProps = {
			blok: {
				...mockProps.blok,
				cards: [
					{
						component: "cardGridRowCalloutWithImage",
						columns: "2",
						gridItems: [
							{
								...mockCalloutCardWithImageProps.blok,
							},
							{
								...mockCalloutCardWithImageProps.blok,
							},
						] as CalloutCardWithImageStoryblok[],
						_uid: "row1",
					},
				],
			},
		};
		render(<CardGridSection {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(2);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(2);
	});

	it("renders Testimonial content correctly", () => {
		const mockTestimonialProps: CardGridSectionProps = {
			blok: {
				...mockProps.blok,
				cards: [
					{
						component: "cardGridRowTestimonials",
						columns: "1",
						gridItems: [
							{
								component: "testimonialGridItem",
								_uid: "1",
								filename: "test-file",
								quoteName: "Test Name",
								quoteRole: "Test Role",
								quoteText: "Test Quote Text",
								image: {
									id: 123,
									filename: "test-image-filename",
									alt: "test-alt",
									fieldtype: "asset",
									name: "test-name",
									title: "test-title",
									focus: null,
								},
								variant: "default",
							} as TestimonialGridItemStoryblok,
						],
						_uid: "row1",
					},
				],
			},
		};
		render(<CardGridSection {...mockTestimonialProps} />);
		const testimonial = screen.getByText("Test Quote Text");
		expect(testimonial).toBeInTheDocument();
		const cardList = screen.queryByRole("list");
		const cardListItems = screen.queryByRole("listitem");
		expect(cardList).not.toBeInTheDocument();
		expect(cardListItems).not.toBeInTheDocument();
	});

	it("matches snapshot", () => {
		const { container } = render(<CardGridSection {...mockProps} />);
		expect(container).toMatchSnapshot();
	});
});
