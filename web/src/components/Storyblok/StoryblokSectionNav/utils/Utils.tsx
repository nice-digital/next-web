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

export const siblingHasChildrenFunction = async (
	currentFolderSlug: string,
	isRootPage: boolean | undefined
): Promise<boolean> => {
	const startsWithCurrentFolderSlugItems = await fetchLinks({
		starts_with: currentFolderSlug,
	});

	// If any items in current folder have children, except for item corresponding with current page, return true
	// We don't want to check this when current page is a root page, because it will always return true, so return false
	const siblingHasChildren = isRootPage ? false : startsWithCurrentFolderSlugItems.some(
		(item) => item.is_folder && item.slug !== currentFolderSlug
	);

	return siblingHasChildren;
};


export const fetchAndBuildParentAndChildTree = async (
	currentFolderSlug: string,
	parentID: number,
	isRootPage: boolean | undefined,
	children?: ExtendedSBLink[],
): Promise<ExtendedSBLink[]> => {

	// Get all items with same parentID as current page
	const currentFolderItems = await getCurrentFolderItems(parentID);

	// Get all items starting with the current folder slug - this is the only way to access the folder object
	const startsWithCurrentFolderSlugItems = await fetchLinks({
		starts_with: currentFolderSlug,
	});

	// Get currentFolder object so we can access its parent_id
	const currentFolder: ExtendedSBLink | undefined =
		startsWithCurrentFolderSlugItems.find(
			(item: ExtendedSBLink) => item.is_folder && item.slug === currentFolderSlug
		);

	const siblingHasChildrenBool = await siblingHasChildrenFunction(currentFolderSlug, isRootPage);

	let tree: ExtendedSBLink[] = [];

	// If no current folder found or current folder has no parent_id, or any of current page's siblings have children, return the currentFolderItems and don't look for parent folder items
	if (!currentFolder || !currentFolder.parent_id || siblingHasChildrenBool) return currentFolderItems;

	// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
	const parentFolderItems = await fetchLinks({
		with_parent: currentFolder.parent_id,
	});

	tree = parentFolderItems;

	// If current page has no children, use current level and level above to create the parent/child tree structure

	if (!(children && children.length > 0)) {
		tree = assignChildrenToParent(currentFolderItems, parentFolderItems);
	}

	return tree;
};

export const fetchCurrentAndParentFolderItems = async (
	parentID: number,
	currentFolderSlug: string,
	isRootPage: boolean | undefined
): Promise<{
	currentAndParentFolderItems: ExtendedSBLink[];
}> => {
	const currentAndParentFolderItemsOrCurrentFolderItems =
		await fetchAndBuildParentAndChildTree(currentFolderSlug, parentID, isRootPage)
	return {
		currentAndParentFolderItems:
			currentAndParentFolderItemsOrCurrentFolderItems,
	};
};

export const buildTree = async (
	parentID: number,
	currentPageSlug: string,
	isRootPage: boolean | undefined
): Promise<ExtendedSBLink[]> => {

	let tree: ExtendedSBLink[] = [];
	const currentFolderItems = await getCurrentFolderItems(parentID);

	const currentFolderSlug = isRootPage ?
		currentPageSlug
		: currentPageSlug.split("/").slice(0, -1).join("/");

	console.log("currentFolderSlug", currentFolderSlug);
	const { currentAndParentFolderItems } =
		await fetchCurrentAndParentFolderItems(parentID, currentFolderSlug, isRootPage);

	tree = assignChildrenToParent(
		currentFolderItems,
		currentAndParentFolderItems
	);

	const currentPageData = tree.find((item) => item.slug === currentPageSlug);

	console.log({isRootPage});
	console.log(">>>>> siblingHasChildrenFunction", await siblingHasChildrenFunction(currentFolderSlug, isRootPage));
	const currentPageHasNoChildren =
		!currentPageData?.childLinks || currentPageData?.childLinks.length === 0;

		console.log("#####", {currentPageHasNoChildren})

	if (currentPageData && currentPageHasNoChildren) {
		tree = await fetchAndBuildParentAndChildTree(
			currentFolderSlug,
			parentID,
			isRootPage,
			currentPageData.childLinks ?? []
		);
	}

	return tree;
};
