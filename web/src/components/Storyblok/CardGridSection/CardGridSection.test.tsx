import { render, screen } from "@testing-library/react";
import { CardGridSection, CardGridSectionProps } from "./CardGridSection";
import { resolveStoryblokLink } from "@/utils/storyblok";
import {
	type TestimonialGridItemStoryblok,
	type CalloutCardStoryblok,
	type CalloutCardWithImageStoryblok,
	type CardStoryblok,
	type CardGridSectionStoryblok,
	type RichtextStoryblok
} from "@/types/storyblok";
import { mockCalloutCardProps, mockCalloutCardWithImageProps } from "../StoryblokCalloutCard/StoryblokCalloutCard.test";

jest.mock("@/utils/storyblok", () => ({
	resolveStoryblokLink: jest.fn(),
	fieldHasValidContent: jest.fn(() => true),
}));

const mockLeadText: RichtextStoryblok = {
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [{ type: "text", text: "This is lead text." }],
		},
	],
};

describe("CardGridSection", () => {
	beforeEach(() => {
		// (resolveStoryblokLink as jest.Mock).mockReturnValue({
		//   url: "https://local-host-test-nice-org.com",
		//   isInternal: false,
		// });
		(resolveStoryblokLink as jest.Mock).mockImplementation((link) => ({
			url: link?.url || link?.cached_url,
			isInternal:
				link?.url?.startsWith("/") || link?.cached_url?.startsWith("/"), //TODO need to check this is correct mocking behaviour
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const mockProps: CardGridSectionProps = {
		blok: {
			component: "cardGridSection",
			_uid: "section1",
			heading: "Test Heading",
			headingLevel: "2",
			leadText: mockLeadText,
			theme: "subtle",
			verticalPadding: "medium",
			cards: [
				{
					component: "cardGridRowBasic",
					columns: "2",
					gridItems: [
						{
							component: "card",
							_uid: "1",
							heading: "Card 1",
							body: "Card 1 body",
							link: {
								fieldtype: "multilink",
								id: "link1",
								url: "https://local-host-test-nice-org.com/link1",
								cached_url: "https://local-host-test-nice-org.com/link1",
								linktype: "url",
							},
						} as CardStoryblok,
					],
					_uid: "row1",
				},
			],
		} as CardGridSectionStoryblok,
	};

	it("renders without crashing", () => {
		render(<CardGridSection {...mockProps} />);
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"Test Heading"
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
		expect(section).toHaveClass("cardGridSection--subtle");
	});

	it("renders the correct grid structure", () => {
		render(<CardGridSection {...mockProps} />);
		const grid = screen
			.getByTestId("card-grid-section")
			.querySelector("div.grid, ul.grid");
		expect(grid).toBeInTheDocument();
	});

	it("resolves links correctly", () => {
		render(<CardGridSection {...mockProps} />);
		const linkElement = screen.getByRole("link", { name: "Card 1" });
		expect(linkElement).toBeInTheDocument();
		expect(linkElement).toHaveAttribute(
			"href",
			"https://local-host-test-nice-org.com/link1"
		);
	});

	it("renders Card content correctly", () => {
		render(<CardGridSection {...mockProps} />);
		const card = screen.getByText("Card 1");
		expect(card).toBeInTheDocument();
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
								quoteName: "Test Name",
								quoteRole: "Test Role",
								quoteText: "Test Quote Text",
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
								...mockCalloutCardProps.blok
							},
							{
								...mockCalloutCardProps.blok
							},
							{
								...mockCalloutCardProps.blok
							},
						] as CalloutCardStoryblok[],
						_uid: "row1",
					},
				],
			},
		};
		render(<CardGridSection {...mockCalloutProps}/>);
		const ul = screen.getByRole('list');
		const li = screen.getAllByRole('listitem');
		const cardHeading = li[0].
		const calloutCard = screen.getAllByText("Mock card title");
		expect(ul).toBeInTheDocument();
		expect(li.length).toBe(3);
		expect(li[0].).toBe('Mock card title');
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
								...mockCalloutCardWithImageProps.blok
							} as CalloutCardWithImageStoryblok,
						],
						_uid: "row1",
					},
				],
			},
		};
		render(<CardGridSection {...mockCalloutProps}/>);
		const calloutCard = screen.getByText("Mock card title");
		expect(calloutCard).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		const { container } = render(<CardGridSection {...mockProps} />);
		expect(container).toMatchSnapshot();
	});
});
