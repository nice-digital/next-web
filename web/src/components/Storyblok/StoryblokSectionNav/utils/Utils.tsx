import { SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

export type ExtendedSBLink = SBLink & {
	childLinks?: ExtendedSBLink[];
};

export const getCurrentFolderItems = async (
	parentID: number
): Promise<ExtendedSBLink[]> => {
	// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
	return await fetchLinks({
		with_parent: parentID,
	});
};

export const assignChildrenToParent = (
	currentFolderItems: ExtendedSBLink[],
	parents: ExtendedSBLink[]
): ExtendedSBLink[] => {
	for (const parent of parents) {
		const children = currentFolderItems.filter(
			(childLink) =>
				childLink.parent_id === parent.id && !childLink.is_startpage
		);

		parent.childLinks = children.length > 0 ? children : [];
	}
	return parents;
};

export const siblingHasChildren = async (
	slug: string,
): Promise<boolean> => {
	//const currentFolderItems = await getCurrentFolderItems(parentID);
	const startsWithCurrentFolderSlugItems = await fetchLinks({
		starts_with: slug,
	});

	// If any items in current folder have children, except for item corresponding with current page, return true
	const siblingHasChildren = startsWithCurrentFolderSlugItems.some(
		(item) => item.is_folder && item.slug !== slug
	);

	console.log({ slug, siblingHasChildren });
	return siblingHasChildren;
};

export const fetchAndBuildParentAndChildTree = async (
	slug: string,
	parentID: number,
	children?: ExtendedSBLink[]
): Promise<ExtendedSBLink[]> => {
	const currentFolderItems = await getCurrentFolderItems(parentID);

	// Get all items starting with the current folder slug - this is the only way to access the folder object
	const startsWithCurrentFolderSlugItems = await fetchLinks({
		starts_with: slug,
	});

	// Get currentFolder object so we can access its parent_id
	const currentFolder: ExtendedSBLink | undefined =
		startsWithCurrentFolderSlugItems.find(
			(item: ExtendedSBLink) => item.is_folder && item.slug === slug
		);

	// Check if any items in current folder, except for item corresponding with current page, have children
	const siblingHasChildren = startsWithCurrentFolderSlugItems.some(
		(item) => item.is_folder && item.slug !== slug
	);

	let tree: ExtendedSBLink[] = [];

	// If no current folder found or current folder has no parent_id, return the currentFolderItems
	if (!currentFolder || !currentFolder.parent_id) return currentFolderItems;

	// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
	const parentFolderItems = await fetchLinks({
		with_parent: currentFolder.parent_id,
	});
	tree = parentFolderItems;

	// If current page has no children, and none of current page's siblings have children, use current level and level above to create the parent/child tree structure
	if (!(children && children.length > 0 && siblingHasChildren)) {
		tree = assignChildrenToParent(currentFolderItems, parentFolderItems);
	}

	return tree;
};

export const fetchCurrentAndParentFolderItems = async (
	parentID: number,
	slug: string
): Promise<{
	currentAndParentFolderItems: ExtendedSBLink[];
}> => {
	const currentAndParentFolderItemsOrCurrentFolderItems =
		await fetchAndBuildParentAndChildTree(slug, parentID);
	return {
		currentAndParentFolderItems:
			currentAndParentFolderItemsOrCurrentFolderItems,
	};
};

export const buildTree = async (
	parentID: number,
	slug: string,
	isRootPage: boolean | undefined
): Promise<ExtendedSBLink[]> => {
	let tree: ExtendedSBLink[] = [];
	const currentFolderItems = await getCurrentFolderItems(parentID);
	const { currentAndParentFolderItems } =
		await fetchCurrentAndParentFolderItems(parentID, slug);
	tree = assignChildrenToParent(
		currentFolderItems,
		currentAndParentFolderItems
	);

	const currentPage = tree.find((item) => item.slug === slug);

	const currentPageOrSiblingHasNoChildren =
		!currentPage?.childLinks || currentPage?.childLinks.length === 0 || !siblingHasChildren;

	if (currentPage && currentPageOrSiblingHasNoChildren) {
		const currentFolderSlug = isRootPage
			? slug
			: slug.split("/").slice(0, -1).join("/");

		tree = await fetchAndBuildParentAndChildTree(
			currentFolderSlug,
			parentID,
			currentPage.childLinks ?? []
		);
	}

	return tree;
};
