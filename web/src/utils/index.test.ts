import { stripTime, formatDateStr, getProjectPath } from "./";
import { ProductGroup } from "@/feeds/publications/types";
import { Project, ProjectStatus } from "@/feeds/inDev/types";

describe("utils", () => {
	describe("stripTime", () => {
		it("should strip time from ISO formatted string", () => {
			expect(stripTime("2020-10-05T12:27:21.5437767")).toBe("2020-10-05");
		});
	});

	describe("formatDateStr", () => {
		it("should format ISO date string as NICE formatted date string", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767")).toBe(
				"05 October 2020"
			);
		});
	});

	describe("getProjectPath", () => {
		it("should return null for advice projects", () => {
			expect(
				getProjectPath({ ProjectGroup: ProductGroup.Advice } as Project)
			).toBeNull();
		});

		it("should return lowercase proposed gid url for proposed status projects", () => {
			expect(
				getProjectPath({
					ProjectGroup: ProductGroup.Guidance,
					Status: ProjectStatus.Proposed,
					Reference: "GID-TA123",
				} as Project)
			).toBe("/guidance/proposed/gid-ta123");
		});

		it("should return lowercase guidance gid url for non-proposed status projects", () => {
			expect(
				getProjectPath({
					ProjectGroup: ProductGroup.Guidance,
					Status: ProjectStatus.InProgress,
					Reference: "GID-TA123",
				} as Project)
			).toBe("/guidance/indevelopment/gid-ta123");
		});
	});
});
