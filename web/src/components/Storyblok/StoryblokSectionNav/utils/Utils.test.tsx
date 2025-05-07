import {
	buildTree,
	fetchAndBuildParentAndChildTree,
	fetchCurrentAndParentFolderItems,
	assignChildrenToParent,
	siblingHasChildren,
	type ExtendedSBLink,
} from "./Utils";

import * as api from "./Utils";
import { fetchLinks } from "@/utils/storyblok";

jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn(),
}));

describe("StoryblokSectionNav Utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("assignChildrenToParent", () => {
		it("assigns children to parents and excludes startpages", () => {
			const parents = [
				{ id: 1, name: "Parent 1" },
				{ id: 2, name: "Parent 2" },
			] as unknown as ExtendedSBLink[];

			const currentFolderItems = [
				{ id: 10, parent_id: 1, is_startpage: false, name: "Child A" },
				{
					id: 11,
					parent_id: 1,
					is_startpage: true,
					name: "Child B (Startpage)",
				},
				{ id: 12, parent_id: 2, is_startpage: false, name: "Child C" },
			] as unknown as ExtendedSBLink[];

			const result = assignChildrenToParent(currentFolderItems, parents);

			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "childLinks": Array [
			      Object {
			        "id": 10,
			        "is_startpage": false,
			        "name": "Child A",
			        "parent_id": 1,
			      },
			    ],
			    "id": 1,
			    "name": "Parent 1",
			  },
			  Object {
			    "childLinks": Array [
			      Object {
			        "id": 12,
			        "is_startpage": false,
			        "name": "Child C",
			        "parent_id": 2,
			      },
			    ],
			    "id": 2,
			    "name": "Parent 2",
			  },
			]
		`);

			const parentsWithNoChildren = [
				{ id: 3, name: "Parent 3" },
			] as unknown as ExtendedSBLink[];

			const resultWithNoChildren = assignChildrenToParent(
				currentFolderItems,
				parentsWithNoChildren
			);

			expect(resultWithNoChildren).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "childLinks": Array [],
			    "id": 3,
			    "name": "Parent 3",
			  },
			]
		`);
		});
	});

	describe("siblingHasChildren", () => {
		const startsWithCurrentFolderSlugItems = [
			{ slug: "foo", is_folder: true }, // current folder (ignored)
			{ slug: "foo/child1", is_folder: true }, // valid sibling folder
			{ slug: "foo/child2", is_folder: false }, // not a folder
		] as unknown as ExtendedSBLink[];

		it("returns false when isRootPage is true (skips check)", async () => {
			const result = await siblingHasChildren(
				"foo",
				startsWithCurrentFolderSlugItems,
				true
			);
			expect(result).toMatchInlineSnapshot(`false`);
		});

		it("returns true when a sibling folder exists", async () => {
			const result = await siblingHasChildren(
				"foo",
				startsWithCurrentFolderSlugItems,
				false
			);
			expect(result).toMatchInlineSnapshot(`true`);
		});

		it("returns false when no sibling folders exist", async () => {
			const noSiblings = [
				{ slug: "foo", is_folder: true },
				{ slug: "foo/leaf", is_folder: false },
			] as unknown as ExtendedSBLink[];
			const result = await siblingHasChildren("foo", noSiblings, false);
			expect(result).toMatchInlineSnapshot(`false`);
		});
	});

	describe("fetchAndBuildParentAndChildTree", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		const currentFolderSlug = "parent/child";
		const parentID = 123;

		const mockCurrentFolder: any = {
			id: 1,
			slug: currentFolderSlug,
			is_folder: true,
			parent_id: 10,
		};

		const mockSiblingFolder = {
			slug: "parent/child/sibling",
			is_folder: true,
		};

		const currentFolderItems = [
			{ id: 2, parent_id: 123, slug: "parent/child/page", is_folder: false },
		] as unknown as ExtendedSBLink[];

		const parentFolderItems = [
			{ id: 3, parent_id: 10, slug: "parent/page1", is_folder: false },
		] as unknown as ExtendedSBLink[];

		it("returns currentFolderItems early if currentFolder not found", async () => {
			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);
			(fetchLinks as jest.Mock).mockResolvedValue([]);
			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(false);

			const result = await fetchAndBuildParentAndChildTree(
				currentFolderSlug,
				parentID,
				false
			);
			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "id": 2,
			    "is_folder": false,
			    "parent_id": 123,
			    "slug": "parent/child/page",
			  },
			]
		`);
		});

		it("returns currentFolderItems early if siblingHasChildren is true", async () => {
			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);
			(fetchLinks as jest.Mock).mockResolvedValue([
				mockCurrentFolder,
				mockSiblingFolder,
			]);
			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(true);

			const result = await fetchAndBuildParentAndChildTree(
				currentFolderSlug,
				parentID,
				false
			);
			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "id": 2,
			    "is_folder": false,
			    "parent_id": 123,
			    "slug": "parent/child/page",
			  },
			]
		`);
		});

		it("returns parentFolderItems with children assigned when no sibling has children", async () => {
			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);
			(fetchLinks as jest.Mock)
				.mockResolvedValueOnce([mockCurrentFolder]) // startsWithCurrentFolderSlugItems
				.mockResolvedValueOnce(parentFolderItems); // parentFolderItems
			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(false);
			jest
				.spyOn(api, "assignChildrenToParent")
				.mockImplementation((current, parents) => {
					parents[0].childLinks = current;
					return parents;
				});

			const result = await fetchAndBuildParentAndChildTree(
				currentFolderSlug,
				parentID,
				false
			);

			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "childLinks": Array [
			      Object {
			        "id": 2,
			        "is_folder": false,
			        "parent_id": 123,
			        "slug": "parent/child/page",
			      },
			    ],
			    "id": 3,
			    "is_folder": false,
			    "parent_id": 10,
			    "slug": "parent/page1",
			  },
			]
		`);
		});
	});

	describe("fetchCurrentAndParentFolderItems", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		const mockTree = [
			{ id: 1, slug: "parent/page", is_folder: false, parent_id: 123 },
			{ id: 2, slug: "parent/child", is_folder: false, parent_id: 123 },
		] as unknown as ExtendedSBLink[];

		it("calls fetchAndBuildParentAndChildTree and wraps result in object", async () => {
			jest
				.spyOn(api, "fetchAndBuildParentAndChildTree")
				.mockResolvedValue(mockTree);

			const result = await fetchCurrentAndParentFolderItems(
				123,
				"parent/child",
				false
			);

			expect(fetchAndBuildParentAndChildTree).toHaveBeenCalledWith(
				"parent/child",
				123,
				false
			);
			expect(result).toMatchInlineSnapshot(`
			Object {
			  "currentAndParentFolderItems": Array [
			    Object {
			      "id": 1,
			      "is_folder": false,
			      "parent_id": 123,
			      "slug": "parent/page",
			    },
			    Object {
			      "id": 2,
			      "is_folder": false,
			      "parent_id": 123,
			      "slug": "parent/child",
			    },
			  ],
			}
		`);
		});
	});

	describe("buildTree", () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});

		const parentID = 123;
		const currentPageSlug = "parent/child/page";

		const currentFolderItems = [
			{
				id: 10,
				slug: "parent/child/page",
				parent_id: parentID,
				is_folder: false,
			},
		] as unknown as ExtendedSBLink[];

		const currentAndParentFolderItems = [
			{ id: 1, slug: "parent/page", parent_id: parentID, is_folder: false },
			{
				id: 10,
				slug: "parent/child/page",
				parent_id: parentID,
				is_folder: false,
			},
		] as unknown as ExtendedSBLink[];

		it("builds tree when current page has children", async () => {
			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);
			jest.spyOn(api, "fetchCurrentAndParentFolderItems").mockResolvedValue({
				currentAndParentFolderItems,
			});
			jest
				.spyOn(api, "assignChildrenToParent")
				.mockImplementation((current, parents) => {
					parents[1].childLinks = [
						{ id: 99, slug: "child", parent_id: 10 },
					] as unknown as ExtendedSBLink[];
					return parents;
				});
			jest.spyOn(api, "fetchAndBuildParentAndChildTree").mockResolvedValue([]);

			const result = await buildTree(parentID, currentPageSlug, false);

			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "id": 1,
			    "is_folder": false,
			    "parent_id": 123,
			    "slug": "parent/page",
			  },
			  Object {
			    "childLinks": Array [
			      Object {
			        "id": 99,
			        "parent_id": 10,
			        "slug": "child",
			      },
			    ],
			    "id": 10,
			    "is_folder": false,
			    "parent_id": 123,
			    "slug": "parent/child/page",
			  },
			]
		`);
		});
		it("uses full slug when isRootPage is true", async () => {
			const fullSlug = "a/b/c";
			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);
			const fetchSpy = jest
				.spyOn(api, "fetchCurrentAndParentFolderItems")
				.mockResolvedValue({ currentAndParentFolderItems });
			jest
				.spyOn(api, "assignChildrenToParent")
				.mockReturnValue(currentAndParentFolderItems);

			await buildTree(parentID, fullSlug, true);

			expect(fetchSpy).toHaveBeenCalledWith(parentID, fullSlug, true);
		});
		it("calls fetchAndBuildParentAndChildTree when current page has no children", async () => {
			const parentID = 123;
			const currentPageSlug = "parent/child/page";
			const currentFolderSlug = "parent/child";

			const currentFolderItems = [
				{
					id: 10,
					slug: currentPageSlug,
					parent_id: parentID,
					is_folder: false,
				},
			] as unknown as ExtendedSBLink[];

			const currentAndParentFolderItems = [
				{
					id: 1,
					slug: "parent/page",
					parent_id: parentID,
					is_folder: false,
				},
				{
					id: 10,
					slug: currentPageSlug,
					parent_id: parentID,
					is_folder: false,
				},
			] as unknown as ExtendedSBLink[];

			jest
				.spyOn(api, "getCurrentFolderItems")
				.mockResolvedValue(currentFolderItems);

			jest.spyOn(api, "fetchCurrentAndParentFolderItems").mockResolvedValue({
				currentAndParentFolderItems,
			});

			jest
				.spyOn(api, "assignChildrenToParent")
				.mockImplementation((current, parents) => {
					parents[1].childLinks = []; // Simulate no children
					return parents;
				});

			const fetchAndBuildParentAndChildTreeSpy = jest
				.spyOn(api, "fetchAndBuildParentAndChildTree")
				.mockResolvedValue([
					{
						id: 42,
						slug: "rebuilt",
						parent_id: parentID,
						is_folder: false,
					},
				] as unknown as ExtendedSBLink[]);

			const result = await buildTree(parentID, currentPageSlug, false);

			expect(fetchAndBuildParentAndChildTreeSpy).toHaveBeenCalledWith(
				currentFolderSlug,
				parentID,
				false,
				[]
			);

			expect(result).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "id": 42,
			    "is_folder": false,
			    "parent_id": 123,
			    "slug": "rebuilt",
			  },
			]
		`);
		});
	});
});
