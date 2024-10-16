// import { render, screen } from "@testing-library/react";

// import { CardGridStoryblok } from "@/types/storyblok";
// import { resolveStoryblokLink } from "@/utils/storyblok";

// import { CardGrid } from "./StoryblokGridSection";

// jest.mock("next/router", () => ({
// 	useRouter: jest.fn(),
// }));

// jest.mock("@/utils/storyblok", () => ({
// 	resolveStoryblokLink: jest.fn(),
// }));

// describe("CardGrid component", () => {
// 	beforeEach(() => {
// 		(resolveStoryblokLink as jest.Mock).mockImplementation((link) => {
// 			if (link.url && link.url.startsWith("http")) {
// 				return { url: link.url, isInternal: false };
// 			} else if (link.url) {
// 				return { url: link.url, isInternal: true };
// 			} else if (link.email) {
// 				return { url: `mailto:${link.email}`, isInternal: false };
// 			}
// 			return { url: "#", isInternal: true };
// 		});
// 	});

// 	it("renders the correct number of cards", () => {
// 		render(<CardGrid blok={mockBlok} />);
// 		const cardElements = screen.getAllByRole("link");
// 		expect(cardElements).toHaveLength(3);
// 	});
// });
