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

// logic flow
// 1. Fetch story gets the page and its parent id
// 2. Fetch parent and sibling links gets the siblings of the current page
// 3. if the story is an info page build tree by iterating over nav array
// 4. if a node has no children, traverse up the tree to find the first node with children
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

	let tree: Link[] = [];

	if (currentFolder && currentFolder.parent_id) {
		tree = parentFolderItems;
	} else {
		// When on a top-level slug (like "implementing-nice-guidance"), we
		// use the siblings data to populate the render.
		// console.log("No current folder found or current folder has no parent_id");
		tree = currentFolderItems;
	}

	// Filter out the root page from its "children"
	let children = tree.filter((item) => !item.is_startpage);

	// If no children are found, traverse up the tree recursively until children are found (or two level above it)
	// TODO if there are no children, we need to find the first GRANDparent with children
	// TODO NICK requirement - ask Becca to clarify
	let traversalID = currentFolder?.parent_id ?? parentID;
	while (children.length === 0 && traversalID) {
		const items = await fetchLinks({ with_parent: traversalID });
		children = items.filter((item) => !item.is_startpage);
		if (children.length > 0) {
			tree = children;
			break;
		}

		// Move one level up
		const parentNode = startingWithCurrentSlugItems.find(
			(item) => item.id === traversalID
		);
		traversalID =
			parentNode?.parent_id !== undefined ? parentNode.parent_id : 0;
	}

	return tree;
};

export const fetchParentAndSiblingLinks = async (
	token: string,
	parentID: number,
	slug: string
): Promise<{
	siblingsLinksArray: SBLink[];
	parentAndSiblingLinksArray: Link[];
}> => {
	// Fetch sibling links first
	const siblingsLinksArray: SBLink[] = await fetchLinks({
		with_parent: parentID,
	});
	//
	const parentAndSiblingLinksArray = await fetchParentAndChildren(
		slug,
		siblingsLinksArray
	);
	console.log("parentAndSiblingLinksArray", parentAndSiblingLinksArray);
	return { siblingsLinksArray, parentAndSiblingLinksArray };
};
export const filterTreeStructure = (
	siblingsLinksArray: Link[],
	parent: Link
): Link[] => {
	const children = siblingsLinksArray.filter((childLink) => {
		const isChild =
			childLink.parent_id === parent.id && !childLink.is_startpage;

		return isChild;
	});
	return children;
};
export const fetchParentAndChildren = async (
	slug: string,
	siblingsLinksArray: Link[],
	children?: Link[]
): Promise<Link[]> => {
	const startsWithLinksArray = await fetchLinks({
		starts_with: slug,
	});

	const currentFolder: Link | undefined = startsWithLinksArray.find(
		(item: Link) => item.is_folder && item.slug === slug
	);

	let grandparentFolderChildren: Link[] = [];

	if (currentFolder && currentFolder.parent_id) {
		grandparentFolderChildren = await fetchLinks({
			with_parent: currentFolder.parent_id,
		});
		if (!(children && children.length > 0)) {
			grandparentFolderChildren.map((parentelse) => {
				const children = filterTreeStructure(siblingsLinksArray, parentelse);
				parentelse.childLinks = children;
				if (children.length > 0) {
					parentelse.childLinks = children;
				} else {
					parentelse.childLinks = [];
				}
			});
		}
	} else {
		grandparentFolderChildren = siblingsLinksArray;
	}
	return grandparentFolderChildren;
};
