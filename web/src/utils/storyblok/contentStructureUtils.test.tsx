import mockData from "@/mockData/storyblok/sectionNavData.json";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { fetchLinks } from "@/utils/storyblok";

import {
	treeHasItems,
	derivePreheaderFromBreadcrumbs,
} from "./contentStructureUtils";

jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn(),
}));

describe("sectionNavIsNotEmpty", () => {
	it("returns true for a non-empty array", () => {
		const tree = mockData.tree;
		expect(treeHasItems(tree)).toBe(true);
	});

	it("returns false for an empty array", () => {
		expect(treeHasItems([])).toBe(false);
	});
});

describe("derivePreheaderFromBreadcrumbs", () => {
	it("should return undefined if breadcrumbs are undefined", () => {
		expect(derivePreheaderFromBreadcrumbs(undefined)).toBeUndefined();
	});

	it("should return undefined if breadcrumbs only contains one item", () => {
		const mockBreadcrumbs: TypeBreadcrumb[] = [{ title: "Home", path: "/" }];

		expect(derivePreheaderFromBreadcrumbs(mockBreadcrumbs)).toBeUndefined();
	});

	it("should return undefined when the derived candidate is Home", () => {
		const mockBreadcrumbs: TypeBreadcrumb[] = [
			{ title: "Section", path: "/section" },
			{ title: "Home", path: "/" },
		];

		expect(derivePreheaderFromBreadcrumbs(mockBreadcrumbs)).toBeUndefined();
	});

	it("should return undefined breadcrumbs are empty", () => {
		const mockBreadcrumbs: TypeBreadcrumb[] = [];

		expect(derivePreheaderFromBreadcrumbs(mockBreadcrumbs)).toBeUndefined();
	});

	it("should return the last breadcrumb title", () => {
		const mockBreadcrumbs: TypeBreadcrumb[] = [
			{ title: "Home", path: "/" },
			{
				title: "Implementing NICE guidance",
				path: "/implementing-nice-guidance",
			},
			{
				title: "Cost saving, resource planning and audit",
				path: "/implementing-nice-guidance/cost-saving-resource-planning-and-audit",
			},
			{
				title:
					"Supporting the health and care system to implement virtual wards",
				path: "/implementing-nice-guidance/cost-saving-resource-planning-and-audit/supporting-the-health-care-system-to-implement-virtual-wards",
			},
		];

		expect(derivePreheaderFromBreadcrumbs(mockBreadcrumbs)).toEqual(
			mockBreadcrumbs[mockBreadcrumbs.length - 1].title
		);
	});
});
