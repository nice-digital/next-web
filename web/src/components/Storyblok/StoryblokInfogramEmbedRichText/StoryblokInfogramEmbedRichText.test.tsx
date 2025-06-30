import React from "react";
import { render, screen } from "@testing-library/react";
import { InfogramEmbedRichText } from "./StoryblokInfogramEmbedRichText";
import type { InfogramRichTextStoryblok } from "@/types/storyblok";

// Mock child components
jest.mock("../StoryblokRichText/StoryblokRichText", () => ({
	StoryblokRichText: ({ content }: { content: any }) => (
		<div data-testid="mock-richtext">{content?.testContent || "RichText"}</div>
	),
}));
jest.mock("../InfogramEmbed/ClientInfogramEmbed", () => ({
	ClientInfogramEmbed: ({ blok }: { blok: any }) => (
		<div data-testid="mock-infogram">{blok?.testInfogram || "Infogram"}</div>
	),
}));

const blok: InfogramRichTextStoryblok = {
	_uid: "i-ee0b50e2-8fbb-4d2c-ac31-de936a0e0ad0",
	content: {
		type: "doc",
		content: [
			{
				type: "paragraph",
				content: [
					{
						text: "test text",
						type: "text",
					},
				],
			},
		],
	},
	infogram: [
		{
			_uid: "2847533f-1220-427f-9046-59bfd2b9d060",
			component: "infogramEmbed",
			infogramUrl:
				"https://infogram.com/ta-cancer-decisions-by-type-1hxj48nzk5x54vg",
			layoutVariant: "constrained",
			infogramVariant: "interactive",
		},
	],
	infogramSize: "medium",
	infogramPosition: "right",
	hideInfogramOnSmallScreens: "false",
	component: "infogramRichText",
};
describe("InfogramEmbedRichText", () => {
	it("renders the grid with correct test id", () => {
		render(<InfogramEmbedRichText blok={blok} />);
		expect(screen.getByTestId("infogram-richtext")).toBeInTheDocument();
	});

	it("renders infogram on the right by default", () => {
		render(<InfogramEmbedRichText blok={blok} />);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		expect(gridItems[0]).toHaveTextContent("RichText");
		expect(gridItems[1]).toHaveTextContent("Infogram");
	});

	it("renders infogram on the left when infogramPosition is 'left'", () => {
		render(
			<InfogramEmbedRichText blok={{ ...blok, infogramPosition: "left" }} />
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		console.log(gridItems);
		expect(gridItems[0]).toHaveTextContent("Infogram");
		expect(gridItems[1]).toHaveTextContent("RichText");
	});

	it("uses medium size columns by default", () => {
		render(<InfogramEmbedRichText blok={{ ...blok, infogramSize: "" }} />);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		expect(gridItems.length).toBe(2);
		// Columns are passed as props, but not rendered in DOM, so we can't check directly.
	});

	it("uses large size columns when infogramSize is 'large'", () => {
		render(
			<InfogramEmbedRichText blok={{ ...blok, infogramSize: "large" }} />
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		expect(gridItems.length).toBe(2);
	});

	it("applies infogramGridItemClass when hideInfogramOnSmallScreens is true", () => {
		render(
			<InfogramEmbedRichText
				blok={{ ...blok, hideInfogramOnSmallScreens: "true" }}
			/>
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		// Only one of the grid items should have the class
		const withClass = gridItems.filter((item) =>
			item.className.includes("infogramRichText__infogramGrid")
		);
		expect(withClass.length).toBe(1);
	});

	it("does not apply infogramGridItemClass when hideInfogramOnSmallScreens is false", () => {
		render(
			<InfogramEmbedRichText
				blok={{ ...blok, hideInfogramOnSmallScreens: "false" }}
			/>
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		const withClass = gridItems.filter((item) =>
			item.className.includes("infogramRichText__infogramGrid")
		);
		expect(withClass.length).toBe(0);
	});
});
