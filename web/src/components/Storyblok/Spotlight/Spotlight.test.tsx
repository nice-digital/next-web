/* eslint-disable testing-library/no-node-access */
import { render, screen, within } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";
import { RichtextStoryblok } from "@/types/storyblok";

import { Spotlight, type SpotlightProps } from "./Spotlight";

//mock empty richtext field
export const mockEmptyMediaDescriptionRichText: RichtextStoryblok = {
	type: "doc",
	content: [{ type: "paragraph", attrs: { textAlign: null } }],
};

//mock populated richtext field
export const mockMediaDescriptionRichText: RichtextStoryblok = {
	type: "doc",
	content: [
		{
			type: "paragraph",
			content: [
				{
					text: "NICE's chief executive, explains how ",
					type: "text",
				},
				{
					text: "our view",
					type: "text",
					marks: [
						{
							type: "link",
							attrs: {
								href: "/test-webpage",
								uuid: "568-4c-89-672",
								anchor: null,
								target: "_self",
								linktype: "story",
								story: {},
							},
						},
					],
				},
				{
					text: " has been developed in close alignment with the NHS 10 Year Plan.",
					type: "text",
				},
			],
		},
	],
};

const mockBaseSpotlightBlok: SpotlightProps["blok"] = {
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
};

const mockSpotlight: SpotlightProps = {
	blok: mockBaseSpotlightBlok,
};

const mockSpotlightWithLegacyMediaDescription: SpotlightProps = {
	blok: {
		...mockBaseSpotlightBlok,
		mediaDescription: "Mock media description",
		mediaDescriptionRichtext: mockEmptyMediaDescriptionRichText,
	},
};

const mockSpotlightWithRichTextMediaDescription: SpotlightProps = {
	blok: {
		...mockBaseSpotlightBlok,
		mediaDescription: "some text that isn't rendered",
		mediaDescriptionRichtext: { ...mockMediaDescriptionRichText },
	},
};

const mockSpotlightWithNoMediaDescription: SpotlightProps = {
	blok: {
		...mockBaseSpotlightBlok,
		mediaDescription: undefined,
		mediaDescriptionRichtext: undefined,
	},
};

describe("Spotlight component", () => {
	it("should match snapshot", () => {
		const { container } = render(<Spotlight {...mockSpotlight} />);
		expect(container).toMatchSnapshot();
	});

	it("should render legacy mediaDescription if mediaDescriptionRichtext is empty", () => {
		render(<Spotlight {...mockSpotlightWithLegacyMediaDescription} />);
		expect(screen.getByText("Mock media description")).toBeInTheDocument();
	});

	it("should render the rich text media description if valid mediaDescriptionRichtext is present", () => {
		render(<Spotlight {...mockSpotlightWithRichTextMediaDescription} />);

		expect(screen.getByRole("link", { name: "our view" })).toBeInTheDocument();

		expect(
			screen.queryByText("Mock media description")
		).not.toBeInTheDocument();
	});

	it("should not render any media description if none are provided", () => {
		render(<Spotlight {...mockSpotlightWithNoMediaDescription} />);
		expect(
			screen.queryByRole("link", { name: "our view" })
		).not.toBeInTheDocument();

		expect(
			screen.queryByText("Mock media description")
		).not.toBeInTheDocument();
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
