import { Project, ProjectStatus } from "@/feeds/inDev/types";
import {
	ProductGroup,
	ProductLite,
	ProductTypeAcronym,
} from "@/feeds/publications/types";

import { stripTime, formatDateStr, getProjectPath, getProductPath } from "./";

describe("utils", () => {
	describe("stripTime", () => {
		it("should strip time from ISO formatted string", () => {
			expect(stripTime("2020-10-05T12:27:21.5437767")).toBe("2020-10-05");
		});
	});

	describe("formatDateStr", () => {
		it("should format ISO date string as NICE formatted date string", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767")).toBe(
				"5 October 2020"
			);
		});
		it("should format ISO date string as NICE formatted date string (short version)", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767", true)).toBe(
				"5/10/2020"
			);
		});
	});

	describe("getProjectPath", () => {
		it("should return null for advice projects", () => {
			expect(
				getProjectPath({ ProjectGroup: ProductGroup.Advice } as Project)
			).toBeNull();
		});

		it("should return lowercase awaiting development gid url for proposed status projects", () => {
			expect(
				getProjectPath({
					ProjectGroup: ProductGroup.Guidance,
					Status: ProjectStatus.Proposed,
					Reference: "GID-TA123",
				} as unknown as Project)
			).toBe("/guidance/awaiting-development/gid-ta123");
		});

		it("should return lowercase guidance gid url for non-proposed status projects", () => {
			expect(
				getProjectPath({
					ProjectGroup: ProductGroup.Guidance,
					Status: ProjectStatus.InProgress,
					Reference: "GID-TA123",
				} as unknown as Project)
			).toBe("/guidance/indevelopment/gid-ta123");
		});
	});

	describe("getProductPath", () => {
		it.each([
			[ProductGroup.Guidance, ProductTypeAcronym.TA, "/guidance/ta123"],
			[ProductGroup.Guideline, ProductTypeAcronym.NG, "/guidance/ng123"],
			[ProductGroup.Advice, ProductTypeAcronym.MIB, "/advice/mib123"],
			[ProductGroup.Standard, ProductTypeAcronym.QS, "/guidance/qs123"],
			[ProductGroup.Corporate, ProductTypeAcronym.ECD, "/corporate/ecd123"],
			[ProductGroup.Corporate, ProductTypeAcronym.PMG, "/process/pmg123"],
		])(
			"should return correct path for %s (e.g. %s) products",
			(groupName, productTypeAcronym, expectedPath) => {
				expect(
					getProductPath({
						Id: `${productTypeAcronym}123`,
						ProductType: productTypeAcronym,
						ProductGroup: groupName,
					} as ProductLite)
				).toBe(expectedPath);
			}
		);
	});
});
