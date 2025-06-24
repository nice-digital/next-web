// import { render, screen } from "@testing-library/react";

import mockData from "@/mockData/storyblok/sectionNavData.json";

import { sectionNavIsPopulated } from "./Utils";

describe("sectionNavIsNotEmpty", () => {
	it("returns true for a non-empty array", () => {
		const tree = mockData.tree;
		expect(sectionNavIsPopulated(tree)).toBe(true);
	});

	it("returns false for an empty array", () => {
		expect(sectionNavIsPopulated([])).toBe(false);
	});
});
