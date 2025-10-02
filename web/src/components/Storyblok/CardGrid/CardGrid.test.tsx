import { render, screen } from "@testing-library/react";

import { type StoryblokCalloutCardProps } from "@/components/Storyblok/StoryblokCalloutCard/StoryblokCalloutCard";
import {
	type TestimonialGridItemStoryblok,
	type CalloutCardStoryblok,
	type CalloutCardWithImageStoryblok,
	type CardStoryblok,
} from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import { CardGrid, CardGridProps } from "./CardGrid";

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

describe("GridSection", () => {
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

	const mockProps: CardGridProps = {
		row: {
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
		render(<CardGrid {...mockProps} />);
		const grid = screen.getByTestId("card-grid");
		expect(grid).toBeInTheDocument();
	});

	it("resolves links correctly", () => {
		render(<CardGrid {...mockProps} />);
		const linkElement = screen.getAllByRole("link", {
			name: "Basic Card",
		});
		expect(linkElement[0]).toBeInTheDocument();
		expect(linkElement[0]).toHaveAttribute("href", cardLinkUrl);
	});

	it("renders Card content correctly", () => {
		render(<CardGrid {...mockProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const card = screen.getAllByText("Basic Card");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(1);
		expect(cardListItems[0]).toHaveTextContent("Basic Card");
		expect(card.length).toBe(1);
	});

	it("renders Card content heading level correctly", () => {
		const mockProps: CardGridProps = {
			row: {
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
						headingLevel: "3",
						component: "card",
					},
				],
			},
		};

		render(<CardGrid {...mockProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const card = screen.getAllByText("Basic Card");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(1);
		expect(cardListItems[0]).toHaveTextContent("Basic Card");
		expect(card.length).toBe(1);
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: "Basic Card",
			})
		).toBeInTheDocument();
	});

	it("renders Callout Card content correctly", () => {
		const mockCalloutProps: CardGridProps = {
			row: {
				component: "cardGridRowCallout",
				columns: "3",
				gridItems: [
					{
						...mockCalloutCardProps.blok,
						_uid: "1",
					},
					{
						...mockCalloutCardProps.blok,
						_uid: "2",
					},
					{
						...mockCalloutCardProps.blok,
						_uid: "3",
					},
				] as CalloutCardStoryblok[],
				_uid: "row1",
			},
		};
		render(<CardGrid {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(3);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(3);
	});

	it("renders Callout Card With Image content correctly", () => {
		const mockCalloutProps: CardGridProps = {
			row: {
				component: "cardGridRowCalloutWithImage",
				columns: "2",
				gridItems: [
					{
						...mockCalloutCardWithImageProps.blok,
						_uid: "1",
					},
					{
						...mockCalloutCardWithImageProps.blok,
						_uid: "2",
					},
				] as CalloutCardWithImageStoryblok[],
				_uid: "row1",
			},
		};
		render(<CardGrid {...mockCalloutProps} />);
		const cardList = screen.getByRole("list");
		const cardListItems = screen.getAllByRole("listitem");
		const calloutCard = screen.getAllByText("Mock card title");
		expect(cardList).toBeInTheDocument();
		expect(cardListItems.length).toBe(2);
		expect(cardListItems[0]).toHaveTextContent("Mock card title");
		expect(calloutCard.length).toBe(2);
	});

	it("renders Testimonial content correctly", () => {
		const mockTestimonialProps: CardGridProps = {
			row: {
				component: "cardGridRowTestimonials",
				columns: "1",
				gridItems: [
					{
						component: "testimonialGridItem",
						_uid: "1",
						quoteName: "Test Name",
						quoteRole: "Test Role",
						quoteText: "Test Quote Text",
						image: {
							id: 123,
							filename: "/test-image-filename",
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
		};
		render(<CardGrid {...mockTestimonialProps} />);
		const testimonial = screen.getByText("Test Quote Text");
		expect(testimonial).toBeInTheDocument();
		const cardList = screen.queryByRole("list");
		const cardListItems = screen.queryByRole("listitem");
		expect(cardList).not.toBeInTheDocument();
		expect(cardListItems).not.toBeInTheDocument();
	});

	it("applies correct grid class for infoPage pageType", () => {
		const mockInfoPageProps = {
			...mockProps,
			pageType: "infoPage",
		};
		render(<CardGrid {...mockInfoPageProps} />);
		const cardGrid = screen.getByTestId("card-grid");
		expect(cardGrid).toHaveClass("cardGrid__cardGridRow--isInfoPage");
	});

	it("removes the grid--loose class when pageType is infoPage", () => {
		const mockInfoPageProps = {
			...mockProps,
			pageType: "infoPage",
		};
		render(<CardGrid {...mockInfoPageProps} />);
		const cardGrid = screen.getByTestId("card-grid");
		expect(cardGrid).not.toHaveClass("grid--loose");
	});

	it("applies correct grid class for non-infoPage pageType", () => {
		const mockOtherPageProps = {
			...mockProps,
			pageType: "categoryNavigationPage",
		};
		render(<CardGrid {...mockOtherPageProps} />);
		const cardGrid = screen.getByTestId("card-grid");
		expect(cardGrid).not.toHaveClass("cardGrid__cardGridRow--isInfoPage");
		expect(cardGrid).toHaveClass("grid--loose");
	});

	it("matches snapshot", () => {
		const { container } = render(<CardGrid {...mockProps} />);
		expect(container).toMatchSnapshot();
	});
});
