import { render, screen, within } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";

import { Spotlight, type SpotlightProps } from "./Spotlight";

const mockSpotlight: SpotlightProps = {
	blok: {
		heading: "Mock spotlight title",
		mediaDescription: "Mock media description",
		_uid: "123456789",
		component: "spotlight",
		youtubeEmbed: [
			{
				title: "Test Youtube title",
				source: "wwSzpaTHyS8",
				_uid: "123456",
				component: "youtubeEmbed",
			},
		],
		stories: [mockNewsArticle, mockBlogPost],
	},
};

describe("Spotlight component", () => {
	it("should match snapshot", () => {
		const { container } = render(<Spotlight {...mockSpotlight} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a heading at the correct level if one is specified", () => {
		const spotlight: SpotlightProps = {
			...mockSpotlight,
			headingLevel: 5,
		};

		render(<Spotlight {...spotlight} />);
		expect(
			screen.getByRole("heading", { level: 5, name: "Mock spotlight title" })
		).toBeInTheDocument();
	});
	it("should render each Card with a heading level one deeper than the Spotlight heading", () => {
		const headingLevel = 3; // So Card headings should be level 4
		render(<Spotlight {...mockSpotlight} headingLevel={headingLevel} />);

		const cards = screen.getAllByRole("listitem");
		for (const card of cards) {
			const heading = within(card).getByRole("heading", {
				level: headingLevel + 1,
			});
			expect(heading).toBeInTheDocument();
		}
	});

	it("should not exceed heading level 6 for cards", () => {
		const headingLevel = 6; // cardHeadingLevel becomes undefined
		render(<Spotlight {...mockSpotlight} headingLevel={headingLevel} />);

		const articleLink = screen.getByText("Test news article title");
		expect(articleLink).toBeInTheDocument();
		expect(articleLink.parentElement?.tagName).toBe("P");

		const blogLink = screen.getByText("Test blog post title");
		expect(blogLink).toBeInTheDocument();
		expect(blogLink.parentElement?.tagName).toBe("P");
	});
});
