import { render, screen } from "@testing-library/react";
import React from "react";
import { type StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import type {
	InfogramRichTextStoryblok,
	InfogramEmbedStoryblok,
} from "@/types/storyblok";

import { StoryblokInfogramEmbedRichText } from "./StoryblokInfogramEmbedRichText";

// Mock child components
jest.mock("../StoryblokRichText/StoryblokRichText", () => ({
	StoryblokRichText: ({ content }: { content: StoryblokRichtext }) => (
		<div data-testid="mock-richtext">
			{typeof content?.content === "string" ? content.content : "RichText"}
		</div>
	),
}));
jest.mock("../StoryblokInfogramEmbed/ClientInfogramEmbed", () => ({
	ClientInfogramEmbed: ({ blok }: { blok: InfogramEmbedStoryblok }) => (
		<div data-testid="mock-infogram">
			{(blok as InfogramEmbedStoryblok)?.testInfogram || "Infogram"}
		</div>
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
			displayMode: "withRichText",
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
		render(<StoryblokInfogramEmbedRichText blok={blok} />);
		expect(screen.getByTestId("infogram-richtext")).toBeInTheDocument();
	});

	it("renders infogram on the right by default", () => {
		render(<StoryblokInfogramEmbedRichText blok={blok} />);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		expect(gridItems[0]).toHaveTextContent("RichText");
		expect(gridItems[1]).toHaveTextContent("Infogram");
	});

	it("renders infogram on the left when infogramPosition is 'left'", () => {
		render(
			<StoryblokInfogramEmbedRichText
				blok={{ ...blok, infogramPosition: "left" }}
			/>
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		console.log(gridItems);
		expect(gridItems[0]).toHaveTextContent("Infogram");
		expect(gridItems[1]).toHaveTextContent("RichText");
	});

	it("uses large size columns when infogramSize is 'large'", () => {
		render(
			<StoryblokInfogramEmbedRichText
				blok={{ ...blok, infogramSize: "large" }}
			/>
		);
		const gridItems = screen.getAllByTestId("infogram-richtext-grid-item");
		expect(gridItems.length).toBe(2);
	});

	it("applies infogramGridItemClass when hideInfogramOnSmallScreens is true", () => {
		render(
			<StoryblokInfogramEmbedRichText
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
			<StoryblokInfogramEmbedRichText
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
