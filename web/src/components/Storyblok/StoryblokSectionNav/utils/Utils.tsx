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

export const newFetchParentAndSiblingLinks = async (
	slug: string,
	parentID: number
): Promise<Link[]> => {
	// Get all items starting with the current slug - this is the only way to access the current folder object
	const startingWithCurrentSlugItems = await fetchLinks({ starts_with: slug });
	// Get currentFolder object so we can access its parent_id
	const currentFolder = startingWithCurrentSlugItems.find(
		(item) => item.is_folder && item.slug === slug
	);

	// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
	const currentFolderItems = await fetchLinks({ with_parent: parentID });
	// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
	const parentFolderItems = await fetchLinks({
		with_parent: currentFolder?.parent_id,
	});

	let tree = [];

	if (currentFolder && currentFolder.parent_id) {
		tree = parentFolderItems;
	} else {
		// When on a top-level slug (like "implementing-nice-guidance"), we
		// use the siblings data to populate the render.
		tree = currentFolderItems;
	}

	let children: SBLink[] = [];

	// Filter out the root page from its "children"
	children = currentFolderItems.filter((item) => !item.is_startpage);

	return tree;
};

export const assignChildrenToParent = (
	currentFolderItems: Link[],
	parent: Link
): { parent: Link; children: Link[] } => {
	const children = currentFolderItems.filter(
		(childLink) => childLink.parent_id === parent.id && !childLink.is_startpage
	);

	parent.childLinks = children.length > 0 ? children : [];
	return { parent, children };
};

export const fetchParentAndSiblingLinks = async (
	parentID: number,
	slug: string
): Promise<{
	currentFolderItems: SBLink[];
	storyParentAndSiblings: Link[];
}> => {
	// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
	const currentFolderItems: SBLink[] = await fetchLinks({
		with_parent: parentID,
	});
	//
	const storyParentAndSiblingsOrCurrentFolderItems = await reUseFetchingLogic(
		slug,
		currentFolderItems
	);
	return {
		currentFolderItems,
		storyParentAndSiblings: storyParentAndSiblingsOrCurrentFolderItems,
	};
};

export const reUseFetchingLogic = async (
	slug: string,
	currentFolderItems: Link[],
	children?: Link[]
): Promise<Link[]> => {
	const startsWithLinksArray = await fetchLinks({
		starts_with: slug,
	});

	const currentFolder: Link | undefined = startsWithLinksArray.find(
		(item: Link) => item.is_folder && item.slug === slug
	);

	let parentFolderItems: Link[] = [];

	// no current folder found or current folder has no parent_id return the currentFolderItems
	if (!currentFolder || !currentFolder.parent_id) return currentFolderItems;

	// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
	parentFolderItems = await fetchLinks({
		with_parent: currentFolder.parent_id,
	});

	// if current page has no children
	if (!(children && children.length > 0)) {
		for (const parent of parentFolderItems) {
			const { children: childLinks } = assignChildrenToParent(
				currentFolderItems,
				parent
			);
			parent.childLinks = childLinks;
		}
	}

	return parentFolderItems;
};
