import React from "react";
import { render, screen } from "@testing-library/react";
import { StoryblokOrderedList } from "./StoryblokOrderedList";
import orderedList from "@/mocks/__data__/storyblok/orderedList.json";
import { OrderedListStoryblok } from "@/types/storyblok";

jest.mock("../StoryblokRichText/StoryblokRichText", () => ({
	StoryblokRichText: ({ content }: { content: any }) => {
		const text = content?.content?.[0]?.content?.[0]?.text || "";
		return <div data-testid="storyblok-rich-text">{text}</div>;
	},
}));

describe("OrderedList", () => {
	it("should render the ordered list with correct start and type attributes", () => {
		render(
			<StoryblokOrderedList
				blok={orderedList as OrderedListStoryblok}
				component={"orderedList"}
				_uid={""}
			/>
		);
		const olElements = screen.getAllByRole("list");
		const topLevelList = olElements[0];
		expect(topLevelList).toHaveAttribute("start", "1");
		expect(topLevelList).toHaveAttribute("type", "1");
	});

	it("should render the correct number of list items", () => {
		render(
			<StoryblokOrderedList
				blok={orderedList as OrderedListStoryblok}
				component={"orderedList"}
				_uid={""}
			/>
		);
		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(2);
	});

	it("should render nested ordered list when children exist", () => {
		render(
			<StoryblokOrderedList
				blok={orderedList as OrderedListStoryblok}
				component={"orderedList"}
				_uid={""}
			/>
		);
		const orderedLists = screen.getAllByRole("list");
		expect(orderedLists).toHaveLength(2);
		expect(orderedLists[1]).toHaveAttribute("start", "1");
		expect(orderedLists[1]).toHaveAttribute("type", "a");
	});

	it("should render StoryblokRichText content correctly", () => {
		render(
			<StoryblokOrderedList
				blok={orderedList as OrderedListStoryblok}
				component={"orderedList"}
				_uid={""}
			/>
		);

		expect(screen.getByText("test list item 1")).toBeInTheDocument();
		expect(screen.getByText("nested list item of 1")).toBeInTheDocument();
	});
});
