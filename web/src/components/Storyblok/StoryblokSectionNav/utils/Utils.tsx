import { SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

type Link = {
	childLinks?: Link[];
	id: number;
	slug: string;
	parent_id: number;
	is_folder: boolean;
	is_startpage: boolean;
};


export const assignChildrenToParent = (
	currentFolderItems: Link[],
	parents: Link[]
): Link[] => {
	for (const parent of parents) {
		const children = currentFolderItems.filter(
			(childLink) =>
				childLink.parent_id === parent.id && !childLink.is_startpage
		);

		parent.childLinks = children.length > 0 ? children : [];
	}
	return parents;
};

export const reUseFetchingLogic = async (
	slug: string,
	currentFolderItems: Link[],
	children?: Link[]
): Promise<Link[]> => {
	// Get all items starting with the current folder slug - this is the only way to access the folder object
	const startsWithCurrentFolderSlugItems = await fetchLinks({
		starts_with: slug,
	});

	// Get currentFolder object so we can access its parent_id
	const currentFolder: Link | undefined = startsWithCurrentFolderSlugItems.find(
		(item: Link) => item.is_folder && item.slug === slug
	);

	let tree: Link[] = [];

	// If no current folder found or current folder has no parent_id, return the currentFolderItems
	if (!currentFolder || !currentFolder.parent_id) return currentFolderItems;

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

export const fetchParentAndSiblingLinks = async (
	parentID: number,
	slug: string
): Promise<{
	currentFolderItems: SBLink[];
	currentAndParentFolderItems: Link[];
}> => {
	// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
	const currentFolderItems: SBLink[] = await fetchLinks({
		with_parent: parentID,
	});

	//
	const currentAndParentFolderItemsOrCurrentFolderItems =
		await reUseFetchingLogic(slug, currentFolderItems);
	return {
		currentFolderItems,
		currentAndParentFolderItems:
			currentAndParentFolderItemsOrCurrentFolderItems,
	};
};

export const buildTree = async (
	parentID: number,
	slug: string,
	isRootPage: boolean | undefined
): Promise<Link[]> => {
	let tree: Link[] = [];
	const { currentFolderItems, currentAndParentFolderItems } =
		await fetchParentAndSiblingLinks(parentID, slug);
	tree = assignChildrenToParent(
		currentFolderItems,
		currentAndParentFolderItems
	);

	const currentPage = tree.find((item) => item.slug === slug);

	const currentPageHasNoChildren =
		!currentPage?.childLinks || currentPage?.childLinks.length === 0;

	if (currentPage && currentPageHasNoChildren) {
		const currentFolderSlug = isRootPage
			? slug
			: slug.split("/").slice(0, -1).join("/");

		tree = await reUseFetchingLogic(
			currentFolderSlug,
			currentFolderItems,
			currentPage.childLinks ?? []
		);
	}

	return tree;
};
