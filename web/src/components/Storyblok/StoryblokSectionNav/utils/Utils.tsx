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

	// console.log({ slug, siblingHasChildren });
	return siblingHasChildren;
};

export const fetchAndBuildParentAndChildTree = async (
	slug: string,
	parentID: number,
	children?: ExtendedSBLink[]
): Promise<ExtendedSBLink[]> => {
	//console.trace("fetchAndBuildParentAndChildTree called");
	//console.log("fetchAndBuildParentAndChildTree called with:", { slug, parentID });
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
	// this code stops iterating as soon as it finds a matching element and is not asynchronous
	// //console.log({slug, startsWithCurrentFolderSlugItems})
	// const siblingHasChildrenBool = startsWithCurrentFolderSlugItems.some(
	// 	(item) => item.is_folder && item.slug !== slug
	// );

	const siblingHasChildrenBool = await siblingHasChildrenFunction(slug);
	// //console.log({ slug, siblingHasChildren });

	let tree: ExtendedSBLink[] = [];

	// If no current folder found or current folder has no parent_id, return the currentFolderItems
	if (!currentFolder || !currentFolder.parent_id) return currentFolderItems;

	// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
	const parentFolderItems = await fetchLinks({
		with_parent: currentFolder.parent_id,
	});
	tree = parentFolderItems;

	// If current page has no children, and none of current page's siblings have children, use current level and level above to create the parent/child tree structure

	if (!(children && children.length > 0 && siblingHasChildrenBool)) {
		console.log(
			`No current page children, no current page siblings children, building tree, children: ${children}, children.length: ${children?.length}, siblingHasChildren:${siblingHasChildrenBool}` )
		//console.trace("Conditional block executed: No current page children, no current page siblings children");
		//console.log("No current page children, no current page siblings children, building tree");
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
	//console.trace("buildTree called");
	//console.log("buildTree called with:", { parentID, slug });
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
		!currentPage?.childLinks || currentPage?.childLinks.length === 0 || !siblingHasChildrenFunction;

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
