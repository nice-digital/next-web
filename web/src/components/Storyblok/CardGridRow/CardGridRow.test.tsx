import { render, screen } from "@testing-library/react";

import {
	type CalloutCardStoryblok,
	type CalloutCardWithImageStoryblok,
	type CardStoryblok,
} from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import { type StoryblokCalloutCardProps } from "../StoryblokCalloutCard/StoryblokCalloutCard";

import { CardGridRow, CardGridRowProps } from "./CardGridRow";

jest.mock("@/utils/storyblok", () => ({
	resolveStoryblokLink: jest.fn(),
	fieldHasValidContent: jest.fn(() => true),
	constructStoryblokImageSrc: jest.fn((filename) => filename),
}));

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
			filename: "/test.JPG",
			copyright: "",
			fieldtype: "asset",
			meta_data: {},
			is_external_url: false,
		},
		component: "calloutCardWithImage",
	} as CalloutCardWithImageStoryblok,
};

describe("GridRow", () => {
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

	const mockProps: CardGridRowProps = {
		blok: {
			_uid: "e6d4d18f-e8c3-40af-83e6-b2b6eaa95da3",
			columns: "2",
			component: "cardGridRowBasic",
			gridItems: [
				{
					_uid: "9d9a77de-df8e-4030-a5fd-2e5caa319325",
					body: "Basic card body",
					link: {
						fieldtype: "multilink",
						id: "link1",
						url: cardLinkUrl,
						cached_url: cardLinkUrl,
						linktype: "url",
					},
					heading: "Basic Card",
					component: "card",
				},
			],
		},
	};

	it("renders the correct grid structure", () => {
		render(<CardGridRow {...mockProps} />);
		const grid = screen.getByTestId("card-grid");
		expect(grid).toBeInTheDocument();
	});

	it("resolves links correctly", () => {
		render(<CardGridRow {...mockProps} />);
		const linkElement = screen.getAllByRole("link", {
			name: "Basic Card",
		});
		expect(linkElement[0]).toBeInTheDocument();
		expect(linkElement[0]).toHaveAttribute("href", cardLinkUrl);
	});

	it("renders Card content correctly", () => {
		render(<CardGridRow {...mockProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const card = screen.getAllByText("Basic Card");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(1);
		expect(cardListItems[0]).toHaveTextContent("Basic Card");
		expect(card.length).toBe(1);
	});

	it("renders Callout Card content correctly", () => {
		const mockCalloutProps: CardGridRowProps = {
			blok: {
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
		};
		render(<CardGridRow {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(3);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(3);
	});

	it("renders Callout Card With Image content correctly", () => {
		const mockCalloutProps: CardGridRowProps = {
			blok: {
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
		};
		render(<CardGridRow {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(2);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(2);
	});
});
