import { fetchLinks } from "@/utils/storyblok";

import {
	buildTree,
	type ExtendedSBLink,
	getFoldersWithPublishedStartpage,
	removeUnpublishedFolders,
} from "./Utils";

jest.mock("@/utils/storyblok", () => ({
	fetchLinks: jest.fn(),
}));

const mockFetchLinks = fetchLinks as jest.MockedFunction<typeof fetchLinks>;

const link = (overrides: Partial<ExtendedSBLink>): ExtendedSBLink => ({
	id: 0,
	uuid: "",
	slug: "",
	name: "",
	path: null,
	parent_id: null,
	is_folder: false,
	published: true,
	is_startpage: false,
	position: 0,
	real_path: "",
	...overrides,
});

// Section "about-us" (folder 1) with a startpage and a page,
// a published folder "careers" (folder 2) and a folder "coming-soon" (folder 3) with only an unpublished startpage
const sectionFolder = link({
	id: 1,
	slug: "about-us",
	is_folder: true,
	published: false,
});
const sectionStartpage = link({
	id: 10,
	slug: "about-us/",
	parent_id: 1,
	is_startpage: true,
});
const page = link({ id: 11, slug: "about-us/our-board", parent_id: 1 });
const publishedFolder = link({
	id: 2,
	slug: "about-us/careers",
	parent_id: 1,
	is_folder: true,
	published: false,
});
const publishedFolderStartpage = link({
	id: 20,
	slug: "about-us/careers/",
	parent_id: 2,
	is_startpage: true,
});
const unpublishedFolder = link({
	id: 3,
	slug: "about-us/coming-soon",
	parent_id: 1,
	is_folder: true,
	published: false,
});

// The links API omits unpublished stories, so the unpublished folder's startpage never appears
const publishedSectionLinks = [
	sectionFolder,
	sectionStartpage,
	page,
	publishedFolder,
	publishedFolderStartpage,
	unpublishedFolder,
];

describe("getFoldersWithPublishedStartpage", () => {
	beforeEach(() => {
		mockFetchLinks.mockReset();
	});

	it("fetches links for the top level section", async () => {
		mockFetchLinks.mockResolvedValue(publishedSectionLinks);

		await getFoldersWithPublishedStartpage("about-us/careers/vacancies");

		expect(mockFetchLinks).toHaveBeenCalledWith({ starts_with: "about-us" });
	});

	it("returns the ids of folders that have a published startpage", async () => {
		mockFetchLinks.mockResolvedValue(publishedSectionLinks);

		const folders = await getFoldersWithPublishedStartpage("about-us");

		expect(Array.from(folders).sort()).toEqual([1, 2]);
	});
});

describe("removeUnpublishedFolders", () => {
	const foldersWithPublishedStartpage = new Set([1, 2]);

	it("keeps folders with a published startpage and pages", () => {
		const result = removeUnpublishedFolders(
			[sectionStartpage, page, publishedFolder],
			foldersWithPublishedStartpage
		);

		expect(result.map((l) => l.id)).toEqual([10, 11, 2]);
	});

	it("removes folders without a published startpage", () => {
		const result = removeUnpublishedFolders(
			[sectionStartpage, unpublishedFolder, page],
			foldersWithPublishedStartpage
		);

		expect(result.map((l) => l.id)).toEqual([10, 11]);
	});

	it("removes folders without a published startpage from child links", () => {
		const result = removeUnpublishedFolders(
			[
				{
					...sectionStartpage,
					childLinks: [page, publishedFolder, unpublishedFolder],
				},
			],
			foldersWithPublishedStartpage
		);

		expect(result[0].childLinks?.map((l) => l.id)).toEqual([11, 2]);
	});

	it("does not mutate the original links", () => {
		const parent = {
			...sectionStartpage,
			childLinks: [page, unpublishedFolder],
		};

		removeUnpublishedFolders([parent], foldersWithPublishedStartpage);

		expect(parent.childLinks).toHaveLength(2);
	});
});

describe("buildTree", () => {
	beforeEach(() => {
		mockFetchLinks.mockReset();
	});

	it("omits folders without a published startpage from the section nav", async () => {
		mockFetchLinks.mockImplementation(async (params) => {
			if (params.with_parent === 1)
				return [sectionStartpage, page, publishedFolder, unpublishedFolder];
			if (params.starts_with) return publishedSectionLinks;
			return [];
		});

		const tree = await buildTree(1, "about-us/", true);

		expect(tree.map((l) => l.id)).toEqual([10, 11, 2]);
	});
});
