import { render, screen } from "@testing-library/react";
import React from "react";

import { PanelStoryblok, RichtextStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

import { StoryblokPanel } from "./StoryblokPanel";

jest.mock("../StoryblokRichText/StoryblokRichText", () => ({
	StoryblokRichText: ({ content }: { content: RichtextStoryblok }) => {
		const text = content?.content?.[0]?.content?.[0]?.text || "";
		return <div data-testid="storyblok-rich-text">{text}</div>;
	},
}));

jest.mock("@/utils/storyblok", () => ({
	fieldHasValidContent: jest.fn(),
}));
const mockData: PanelStoryblok = {
	_uid: "i-e384a8c2-5338-4c7a-b8ef-c2d6b1572e76",
	content: {
		type: "doc",
		content: [
			{
				type: "paragraph",
				attrs: {
					textAlign: null,
				},
				content: [
					{
						text: "content area",
						type: "text",
					},
				],
			},
		],
	},
	heading: "heading1",
	variant: "impact",
	headingLevel: "3",
	component: "panel",
};

describe("StoryblokPanel", () => {
	beforeEach(() => {
		jest.resetAllMocks();
		(fieldHasValidContent as jest.Mock).mockReturnValue(true);
	});

	it("renders heading and rich text content when content is valid", () => {
		render(<StoryblokPanel blok={mockData} />);
		expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
			"heading1"
		);
		expect(screen.getByTestId("storyblok-rich-text")).toHaveTextContent(
			"content area"
		);
	});

	it("reners with heading level 2 ", () => {
		const data = { ...mockData, headingLevel: "2" };
		render(<StoryblokPanel blok={data} />);
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"heading1"
		);
	});

	it("does not render StoryblokRichText when fieldHasValidContent returns false", () => {
		(fieldHasValidContent as jest.Mock).mockReturnValue(false);
		render(<StoryblokPanel blok={mockData} />);
		expect(screen.queryByTestId("storyblok-rich-text")).not.toBeInTheDocument();
	});

	it.each([
		["supporting", "panel--supporting"],
		["primary", "panel--primary"],
		["impact", "panel--impact"],
	])("renders with %s variant", (variant, expectedClass) => {
		const data = {
			...mockData,
			variant: variant as "supporting" | "primary" | "impact",
		};

		render(<StoryblokPanel blok={data} />);

		const panel = screen.getByTestId("storyblok-panel");
		expect(panel).toHaveClass(expectedClass);
	});
});
