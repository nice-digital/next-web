import {
  buildTree,
  fetchAndBuildParentAndChildTree,
  fetchCurrentAndParentFolderItems,
  assignChildrenToParent,
  getCurrentFolderItems,
} from "./Utils";
import * as api from "./Utils";
import { fetchLinks } from "@/utils/storyblok";

jest.mock("@/utils/storyblok", () => ({
  fetchLinks: jest.fn(),
}));

describe("Utils Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("assignChildrenToParent", () => {
    it("assigns children to parent items, excluding startpages", () => {
      const parents = [
        { id: 1, name: "P1" },
        { id: 2, name: "P2" },
      ] as unknown as any;

      const items = [
        { id: 10, parent_id: 1, is_startpage: false },
        { id: 11, parent_id: 1, is_startpage: true },
        { id: 12, parent_id: 2, is_startpage: false },
      ] as unknown as any;

      const result = assignChildrenToParent(items, parents);

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
    const folder = { id: 2, slug, is_folder: true, parent_id: 1 } as any;

    it("returns currentFolderItems if no folder found or no parent_id", async () => {
      jest.spyOn(api, "getCurrentFolderItems").mockResolvedValue([{ id: 3 }] as any);
      (fetchLinks as jest.Mock).mockResolvedValue([]);

      const res = await fetchAndBuildParentAndChildTree(slug, parentID);
      expect(res).toEqual([{ id: 3 }]);
    });

    it("assigns children when no children param provided", async () => {
      const currentItems = [{ id: 3, parent_id: parentID }];
      const starts = [folder];
      const parentItems = [{ id: 4, parent_id: 1 }];
      jest.spyOn(api, "getCurrentFolderItems").mockResolvedValue(currentItems as any);
      (fetchLinks as jest.Mock)
        .mockResolvedValueOnce(starts)
        .mockResolvedValueOnce(parentItems);
      const spyAssign = jest.spyOn(api, "assignChildrenToParent");

      const res = await fetchAndBuildParentAndChildTree(slug, parentID);
      expect(spyAssign).toHaveBeenCalledWith(currentItems, parentItems);
      expect(res).toBeDefined();
    });

    it("skips assignChildren when children array passed", async () => {
      const currentItems = [{ id: 3, parent_id: parentID }];
      const parentItems = [{ id: 4, parent_id: 1 }];
      jest.spyOn(api, "getCurrentFolderItems").mockResolvedValue(currentItems as any);
      (fetchLinks as jest.Mock)
        .mockResolvedValueOnce([folder])
        .mockResolvedValueOnce(parentItems);

      const res = await fetchAndBuildParentAndChildTree(slug, parentID, [{ id: 99 } as any]);
      expect(res).toEqual(parentItems);
    });
  });

  describe("fetchCurrentAndParentFolderItems", () => {
    it("wraps result of fetchAndBuildParentAndChildTree", async () => {
      const tree = [{ id: 1 }];
      jest.spyOn(api, "fetchAndBuildParentAndChildTree").mockResolvedValue(tree as any);

      const { currentAndParentFolderItems } = await fetchCurrentAndParentFolderItems(8, "x/y");
      expect(currentAndParentFolderItems).toBe(tree);
    });
  });

  describe("buildTree", () => {
    const parentID = 8;
    const slug = "x/y";

    it("builds and returns a tree", async () => {
      const current = [{ id: 7, slug, parent_id: parentID }];
      const wrapped = [{ id: 1 }, { id: 7, slug, parent_id: parentID }];
      jest.spyOn(api, "getCurrentFolderItems").mockResolvedValue(current as any);
      jest.spyOn(api, "fetchCurrentAndParentFolderItems").mockResolvedValue({ currentAndParentFolderItems: wrapped } as any);
      jest.spyOn(api, "assignChildrenToParent").mockReturnValue(wrapped as any);
      jest.spyOn(api, "fetchAndBuildParentAndChildTree").mockResolvedValue([{ id: 42 }] as any);

      const result = await buildTree(parentID, slug, false);
      expect(result).toBeDefined();
    });
  });
});







// OLD TESTS BELOW
// import {
// 	buildTree,
// 	fetchAndBuildParentAndChildTree,
// 	fetchCurrentAndParentFolderItems,
// 	assignChildrenToParent,
// 	siblingHasChildren,
// 	type ExtendedSBLink,
// } from "./Utils";

// import * as api from "./Utils";
// import { fetchLinks } from "@/utils/storyblok";

// jest.mock("@/utils/storyblok", () => ({
// 	fetchLinks: jest.fn(),
// }));

// describe("StoryblokSectionNav Utils", () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	describe("assignChildrenToParent", () => {
// 		it("assigns children to parents and excludes startpages", () => {
// 			const parents = [
// 				{ id: 1, name: "Parent 1" },
// 				{ id: 2, name: "Parent 2" },
// 			] as unknown as ExtendedSBLink[];

// 			const currentFolderItems = [
// 				{ id: 10, parent_id: 1, is_startpage: false, name: "Child A" },
// 				{
// 					id: 11,
// 					parent_id: 1,
// 					is_startpage: true,
// 					name: "Child B (Startpage)",
// 				},
// 				{ id: 12, parent_id: 2, is_startpage: false, name: "Child C" },
// 			] as unknown as ExtendedSBLink[];

// 			const result = assignChildrenToParent(currentFolderItems, parents);

// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "childLinks": Array [
// 			      Object {
// 			        "id": 10,
// 			        "is_startpage": false,
// 			        "name": "Child A",
// 			        "parent_id": 1,
// 			      },
// 			    ],
// 			    "id": 1,
// 			    "name": "Parent 1",
// 			  },
// 			  Object {
// 			    "childLinks": Array [
// 			      Object {
// 			        "id": 12,
// 			        "is_startpage": false,
// 			        "name": "Child C",
// 			        "parent_id": 2,
// 			      },
// 			    ],
// 			    "id": 2,
// 			    "name": "Parent 2",
// 			  },
// 			]
// 		`);
// 		});
// 	});

// 	describe("siblingHasChildren", () => {
// 		const startsWithCurrentFolderSlugItems = [
// 			{ slug: "foo", is_folder: true }, // current folder (ignored)
// 			{ slug: "foo/child1", is_folder: true }, // valid sibling folder
// 			{ slug: "foo/child2", is_folder: false }, // not a folder
// 		] as unknown as ExtendedSBLink[];

// 		it("returns false when isRootPage is true (skips check)", async () => {
// 			const result = await siblingHasChildren(
// 				"foo",
// 				startsWithCurrentFolderSlugItems,
// 				true
// 			);
// 			expect(result).toMatchInlineSnapshot(`false`);
// 		});

// 		it("returns true when a sibling folder exists", async () => {
// 			const result = await siblingHasChildren(
// 				"foo",
// 				startsWithCurrentFolderSlugItems,
// 				false
// 			);
// 			expect(result).toMatchInlineSnapshot(`true`);
// 		});

// 		it("returns false when no sibling folders exist", async () => {
// 			const noSiblings = [
// 				{ slug: "foo", is_folder: true },
// 				{ slug: "foo/leaf", is_folder: false },
// 			] as unknown as ExtendedSBLink[];
// 			const result = await siblingHasChildren("foo", noSiblings, false);
// 			expect(result).toMatchInlineSnapshot(`false`);
// 		});
// 	});

// 	describe("fetchAndBuildParentAndChildTree", () => {
// 		beforeEach(() => {
// 			jest.resetAllMocks();
// 		});

// 		const currentFolderSlug = "parent/child";
// 		const parentID = 123;

// 		const mockCurrentFolder: any = {
// 			id: 1,
// 			slug: currentFolderSlug,
// 			is_folder: true,
// 			parent_id: 10,
// 		};

// 		const mockSiblingFolder = {
// 			slug: "parent/child/sibling",
// 			is_folder: true,
// 		};

// 		const currentFolderItems = [
// 			{ id: 2, parent_id: 123, slug: "parent/child/page", is_folder: false },
// 		] as unknown as ExtendedSBLink[];

// 		const parentFolderItems = [
// 			{ id: 3, parent_id: 10, slug: "parent/page1", is_folder: false },
// 		] as unknown as ExtendedSBLink[];

// 		it("returns currentFolderItems early if currentFolder not found", async () => {
// 			jest
// 				.spyOn(api, "getCurrentFolderItems")
// 				.mockResolvedValue(currentFolderItems);
// 			(fetchLinks as jest.Mock).mockResolvedValue([]);
// 			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(false);

// 			const result = await fetchAndBuildParentAndChildTree(
// 				currentFolderSlug,
// 				parentID,
// 				false
// 			);
// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "id": 2,
// 			    "is_folder": false,
// 			    "parent_id": 123,
// 			    "slug": "parent/child/page",
// 			  },
// 			]
// 		`);
// 		});

// 		it("returns currentFolderItems early if siblingHasChildren is true", async () => {
// 			jest
// 				.spyOn(api, "getCurrentFolderItems")
// 				.mockResolvedValue(currentFolderItems);
// 			(fetchLinks as jest.Mock).mockResolvedValue([
// 				mockCurrentFolder,
// 				mockSiblingFolder,
// 			]);
// 			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(true);

// 			const result = await fetchAndBuildParentAndChildTree(
// 				currentFolderSlug,
// 				parentID,
// 				false
// 			);
// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "id": 2,
// 			    "is_folder": false,
// 			    "parent_id": 123,
// 			    "slug": "parent/child/page",
// 			  },
// 			]
// 		`);
// 		});

// 		it("returns parentFolderItems with children assigned when no sibling has children", async () => {
// 			jest
// 				.spyOn(api, "getCurrentFolderItems")
// 				.mockResolvedValue(currentFolderItems);
// 			(fetchLinks as jest.Mock)
// 				.mockResolvedValueOnce([mockCurrentFolder]) // startsWithCurrentFolderSlugItems
// 				.mockResolvedValueOnce(parentFolderItems); // parentFolderItems
// 			jest.spyOn(api, "siblingHasChildren").mockResolvedValue(false);
// 			jest
// 				.spyOn(api, "assignChildrenToParent")
// 				.mockImplementation((current, parents) => {
// 					parents[0].childLinks = current;
// 					return parents;
// 				});

// 			const result = await fetchAndBuildParentAndChildTree(
// 				currentFolderSlug,
// 				parentID,
// 				false
// 			);

// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "childLinks": Array [
// 			      Object {
// 			        "id": 2,
// 			        "is_folder": false,
// 			        "parent_id": 123,
// 			        "slug": "parent/child/page",
// 			      },
// 			    ],
// 			    "id": 3,
// 			    "is_folder": false,
// 			    "parent_id": 10,
// 			    "slug": "parent/page1",
// 			  },
// 			]
// 		`);
// 		});
// 	});

// 	describe("fetchCurrentAndParentFolderItems", () => {
// 		beforeEach(() => {
// 			jest.resetAllMocks();
// 		});

// 		const mockTree = [
// 			{ id: 1, slug: "parent/page", is_folder: false, parent_id: 123 },
// 			{ id: 2, slug: "parent/child", is_folder: false, parent_id: 123 },
// 		] as unknown as ExtendedSBLink[];

// 		it("calls fetchAndBuildParentAndChildTree and wraps result in object", async () => {
// 			jest
// 				.spyOn(api, "fetchAndBuildParentAndChildTree")
// 				.mockResolvedValue(mockTree);

// 			const result = await fetchCurrentAndParentFolderItems(
// 				123,
// 				"parent/child",
// 				false
// 			);

// 			expect(fetchAndBuildParentAndChildTree).toHaveBeenCalledWith(
// 				"parent/child",
// 				123,
// 				false
// 			);
// 			expect(result).toMatchInlineSnapshot(`
// 			Object {
// 			  "currentAndParentFolderItems": Array [
// 			    Object {
// 			      "id": 1,
// 			      "is_folder": false,
// 			      "parent_id": 123,
// 			      "slug": "parent/page",
// 			    },
// 			    Object {
// 			      "id": 2,
// 			      "is_folder": false,
// 			      "parent_id": 123,
// 			      "slug": "parent/child",
// 			    },
// 			  ],
// 			}
// 		`);
// 		});
// 	});

// 	describe("buildTree", () => {
// 		beforeEach(() => {
// 			jest.resetAllMocks();
// 		});

// 		const parentID = 123;
// 		const currentPageSlug = "parent/child/page";

// 		const currentFolderItems = [
// 			{
// 				id: 10,
// 				slug: "parent/child/page",
// 				parent_id: parentID,
// 				is_folder: false,
// 			},
// 		] as unknown as ExtendedSBLink[];

// 		const currentAndParentFolderItems = [
// 			{ id: 1, slug: "parent/page", parent_id: parentID, is_folder: false },
// 			{
// 				id: 10,
// 				slug: "parent/child/page",
// 				parent_id: parentID,
// 				is_folder: false,
// 			},
// 		] as unknown as ExtendedSBLink[];

// 		it("builds tree when current page has children", async () => {
// 			jest
// 				.spyOn(api, "getCurrentFolderItems")
// 				.mockResolvedValue(currentFolderItems);
// 			jest.spyOn(api, "fetchCurrentAndParentFolderItems").mockResolvedValue({
// 				currentAndParentFolderItems,
// 			});
// 			jest
// 				.spyOn(api, "assignChildrenToParent")
// 				.mockImplementation((current, parents) => {
// 					parents[1].childLinks = [
// 						{ id: 99, slug: "child", parent_id: 10 },
// 					] as unknown as ExtendedSBLink[];
// 					return parents;
// 				});
// 			jest.spyOn(api, "fetchAndBuildParentAndChildTree").mockResolvedValue([]);

// 			const result = await buildTree(parentID, currentPageSlug, false);

// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "id": 1,
// 			    "is_folder": false,
// 			    "parent_id": 123,
// 			    "slug": "parent/page",
// 			  },
// 			  Object {
// 			    "childLinks": Array [
// 			      Object {
// 			        "id": 99,
// 			        "parent_id": 10,
// 			        "slug": "child",
// 			      },
// 			    ],
// 			    "id": 10,
// 			    "is_folder": false,
// 			    "parent_id": 123,
// 			    "slug": "parent/child/page",
// 			  },
// 			]
// 		`);
// 		});

// 		it("calls fetchAndBuildParentAndChildTree when current page has no children", async () => {
// 			const parentID = 123;
// 			const currentPageSlug = "parent/child/page";
// 			const currentFolderSlug = "parent/child";

// 			const currentFolderItems = [
// 				{
// 					id: 10,
// 					slug: currentPageSlug,
// 					parent_id: parentID,
// 					is_folder: false,
// 				},
// 			] as unknown as ExtendedSBLink[];

// 			const currentAndParentFolderItems = [
// 				{
// 					id: 1,
// 					slug: "parent/page",
// 					parent_id: parentID,
// 					is_folder: false,
// 				},
// 				{
// 					id: 10,
// 					slug: currentPageSlug,
// 					parent_id: parentID,
// 					is_folder: false,
// 				},
// 			] as unknown as ExtendedSBLink[];

// 			jest
// 				.spyOn(api, "getCurrentFolderItems")
// 				.mockResolvedValue(currentFolderItems);

// 			jest.spyOn(api, "fetchCurrentAndParentFolderItems").mockResolvedValue({
// 				currentAndParentFolderItems,
// 			});

// 			jest
// 				.spyOn(api, "assignChildrenToParent")
// 				.mockImplementation((current, parents) => {
// 					parents[1].childLinks = []; // Simulate no children
// 					return parents;
// 				});

// 			const fetchAndBuildParentAndChildTreeSpy = jest
// 				.spyOn(api, "fetchAndBuildParentAndChildTree")
// 				.mockResolvedValue([
// 					{
// 						id: 42,
// 						slug: "rebuilt",
// 						parent_id: parentID,
// 						is_folder: false,
// 					},
// 				] as unknown as ExtendedSBLink[]);

// 			const result = await buildTree(parentID, currentPageSlug, false);

// 			expect(fetchAndBuildParentAndChildTreeSpy).toHaveBeenCalledWith(
// 				currentFolderSlug,
// 				parentID,
// 				false,
// 				[]
// 			);

// 			expect(result).toMatchInlineSnapshot(`
// 			Array [
// 			  Object {
// 			    "id": 42,
// 			    "is_folder": false,
// 			    "parent_id": 123,
// 			    "slug": "rebuilt",
// 			  },
// 			]
// 		`);
// 		});
// 	});
// });
