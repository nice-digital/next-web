import mockData from "@/mockData/storyblok/sectionNavData.json";
import { fetchLinks } from "@/utils/storyblok";

import * as sectionNavUtils from "./Utils";
import { ExtendedSBLink } from "./Utils";

jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn(),
}));

describe("Storyblok Section Navigation Utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("assignChildrenToParent", () => {
		it("assigns children to parent items, excluding startpages", () => {
			const parents = [
				{ id: 1, name: "P1" },
				{ id: 2, name: "P2" },
			] as unknown as sectionNavUtils.ExtendedSBLink[];

			const items = [
				{ id: 10, parent_id: 1, is_startpage: false },
				{ id: 11, parent_id: 1, is_startpage: true },
				{ id: 12, parent_id: 2, is_startpage: false },
			] as unknown as sectionNavUtils.ExtendedSBLink[];

			const result = sectionNavUtils.assignChildrenToParent(items, parents);

			expect(result[0].childLinks).toEqual([
				{ id: 10, parent_id: 1, is_startpage: false },
			]);
			expect(result[1].childLinks).toEqual([
				{ id: 12, parent_id: 2, is_startpage: false },
			]);
		});
	});

	describe("fetchAndBuildParentAndChildTree", () => {
		const slug = "foo/bar";
		const parentID = 5;
		const folder = {
			id: 2,
			slug,
			is_folder: true,
			parent_id: 1,
		} as unknown as sectionNavUtils.ExtendedSBLink;

		it("returns currentFolderItems if no folder found or no parent_id", async () => {
			jest
				.spyOn(sectionNavUtils, "getCurrentFolderItems")
				.mockResolvedValue([{ id: 3 }] as sectionNavUtils.ExtendedSBLink[]);
			(fetchLinks as jest.Mock).mockResolvedValue([]);

			const res = await sectionNavUtils.fetchAndBuildParentAndChildTree(
				slug,
				parentID
			);
			expect(res).toEqual([{ id: 3 }]);
		});

		it("assigns children when no children param provided", async () => {
			const currentItems = [{ id: 3, parent_id: parentID }];
			const starts = [folder];
			const parentItems = [{ id: 4, parent_id: 1 }];
			jest
				.spyOn(sectionNavUtils, "getCurrentFolderItems")
				.mockResolvedValue(currentItems as sectionNavUtils.ExtendedSBLink[]);
			(fetchLinks as jest.Mock)
				.mockResolvedValueOnce(starts)
				.mockResolvedValueOnce(parentItems);
			const spyAssign = jest.spyOn(sectionNavUtils, "assignChildrenToParent");

			const res = await sectionNavUtils.fetchAndBuildParentAndChildTree(
				slug,
				parentID
			);
			expect(spyAssign).toHaveBeenCalledWith(currentItems, parentItems);
			expect(res).toBeDefined();
		});

		it("skips assignChildren when children array passed", async () => {
			const currentItems = [{ id: 3, parent_id: parentID }];
			const parentItems = [{ id: 4, parent_id: 1 }];
			jest
				.spyOn(sectionNavUtils, "getCurrentFolderItems")
				.mockResolvedValue(currentItems as sectionNavUtils.ExtendedSBLink[]);
			(fetchLinks as jest.Mock)
				.mockResolvedValueOnce([folder])
				.mockResolvedValueOnce(parentItems);

			const res = await sectionNavUtils.fetchAndBuildParentAndChildTree(
				slug,
				parentID,
				[{ id: 99 } as sectionNavUtils.ExtendedSBLink]
			);
			expect(res).toEqual(parentItems);
		});
	});

	describe("fetchCurrentAndParentFolderItems", () => {
		it("wraps result of fetchAndBuildParentAndChildTree", async () => {
			const tree = [{ id: 1 }];
			jest
				.spyOn(sectionNavUtils, "fetchAndBuildParentAndChildTree")
				.mockResolvedValue(tree as sectionNavUtils.ExtendedSBLink[]);

			const { currentAndParentFolderItems } =
				await sectionNavUtils.fetchCurrentAndParentFolderItems(8, "x/y");
			expect(currentAndParentFolderItems).toBe(tree);
		});
	});

	describe("buildTree", () => {
		const parentID = 8;
		const slug = "x/y";

		it("builds and returns a tree", async () => {
			const current = [{ id: 7, slug, parent_id: parentID }];
			const wrapped = [{ id: 1 }, { id: 7, slug, parent_id: parentID }];
			jest
				.spyOn(sectionNavUtils, "getCurrentFolderItems")
				.mockResolvedValue(current as sectionNavUtils.ExtendedSBLink[]);
			jest
				.spyOn(sectionNavUtils, "fetchCurrentAndParentFolderItems")
				.mockResolvedValue({ currentAndParentFolderItems: wrapped } as {
					currentAndParentFolderItems: sectionNavUtils.ExtendedSBLink[];
				});
			jest
				.spyOn(sectionNavUtils, "assignChildrenToParent")
				.mockReturnValue(wrapped as sectionNavUtils.ExtendedSBLink[]);
			jest
				.spyOn(sectionNavUtils, "fetchAndBuildParentAndChildTree")
				.mockResolvedValue([{ id: 42 }] as sectionNavUtils.ExtendedSBLink[]);

			const result = await sectionNavUtils.buildTree(parentID, slug, false);
			expect(result).toBeDefined();
		});
	});

	describe("sectionNavIsPopulated", () => {
		it("returns true for a non-empty array", () => {
			const tree = (mockData as { tree: ExtendedSBLink[] }).tree; // casting to avoid TS shape mismatch
			expect(sectionNavUtils.sectionNavIsPopulated(tree)).toBe(true);
		});

		it("returns false for an empty array", () => {
			expect(sectionNavUtils.sectionNavIsPopulated([])).toBe(false);
		});
	});
});
