// import { render, screen } from "@testing-library/react";

import mockData from "@/mockData/storyblok/sectionNavData.json";

import { treeHasItems } from "./contentStructureUtils";

describe("sectionNavIsNotEmpty", () => {
	it("returns true for a non-empty array", () => {
		const tree = mockData.tree;
		expect(treeHasItems(tree)).toBe(true);
	});

	it("returns false for an empty array", () => {
		expect(treeHasItems([])).toBe(false);
	});
});
