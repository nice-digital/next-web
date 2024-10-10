import { render, screen } from "@testing-library/react";

import { CardGridStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import { CardGrid } from "./CardGrid";

jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

jest.mock("@/utils/storyblok", () => ({
	resolveStoryblokLink: jest.fn(),
}));

describe("CardGrid component", () => {
	const mockBlok: CardGridStoryblok = {
		_uid: "i-219f2",
		cards: [
			{
				_uid: "dc83e6",
				body: "Helping you define, improve, and measure quality in health, public health, and social care.",
				link: {
					url: "/internal-link",
				},
				heading: "Quality improvement - using our standards and indicators",
				component: "card",
			},
			{
				_uid: "c61a66",
				body: "Resources and recommendations for social care professionals",
				link: {
					url: "https://www.example.com/external-link",
				},
				heading: "Guidelines and resources for social care",
				component: "card",
			},
			{
				_uid: "37a78e",
				body: "Explore ways to plan, save money, and make decisions on the best ways to use resources.",
				link: {
					email: "example@nice.org.uk",
				},
				heading: "Productivity, planning and cost-saving resources",
				component: "card",
			},
		],
		component: "cardGrid",
	};

	beforeEach(() => {
		(resolveStoryblokLink as jest.Mock).mockImplementation((link) => {
			if (link.url && link.url.startsWith("http")) {
				return { url: link.url, isInternal: false };
			} else if (link.url) {
				return { url: link.url, isInternal: true };
			} else if (link.email) {
				return { url: `mailto:${link.email}`, isInternal: false };
			}
			return { url: "#", isInternal: true };
		});
	});

	it("renders the correct number of cards", () => {
		render(<CardGrid blok={mockBlok} />);
		const cardElements = screen.getAllByRole("link");
		expect(cardElements).toHaveLength(3);
	});

	it("renders external links as <a> tags", () => {
		render(<CardGrid blok={mockBlok} />);
		const externalLink = screen.getByRole("link", {
			name: "Guidelines and resources for social care",
		});
		expect(externalLink.tagName).toBe("A");
		expect(externalLink).toHaveAttribute(
			"href",
			"https://www.example.com/external-link"
		);
	});

	it("renders card without link when no link is provided", () => {
		const mockBlokWithoutLink = {
			...mockBlok,
			cards: mockBlok.cards.map((card) =>
				card.heading ===
				"Quality improvement - using our standards and indicators"
					? { ...card, link: undefined } // Override to remove the link
					: card
			),
		};
		render(<CardGrid blok={mockBlokWithoutLink} />);
		const cardWithoutLink = screen.getByText(
			"Quality improvement - using our standards and indicators"
		);
		// eslint-disable-next-line testing-library/no-node-access
		expect(cardWithoutLink.closest("a")).toBeNull();
	});

	it("renders mailto links correctly", () => {
		render(<CardGrid blok={mockBlok} />);
		const mailtoLink = screen.getByRole("link", {
			name: "Productivity, planning and cost-saving resources",
		});
		expect(mailtoLink.tagName).toBe("A");
		expect(mailtoLink).toHaveAttribute("href", "mailto:example@nice.org.uk");
	});
});
