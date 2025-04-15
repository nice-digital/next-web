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
	parentID: number,
): Promise<Link[]> => {

// Get all items starting with the current slug - this is the only way to access the current folder object
const startingWithCurrentSlugItems = await fetchLinks({starts_with: slug});
// Get currentFolder object so we can access its parent_id
const currentFolder = startingWithCurrentSlugItems.find((item)=> item.is_folder && item.slug === slug);

// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
const currentFolderItems = await fetchLinks({with_parent: parentID});
// Get all items in current folder's parent folder (current "page" and its siblings OR parent page and its siblings, depending on current position in tree)
const parentFolderItems = await fetchLinks({with_parent: currentFolder?.parent_id});

let tree = []

	if(currentFolder && currentFolder.parent_id) {
		tree = parentFolderItems
	} else {
		// When on a top-level slug (like "implementing-nice-guidance"), we
	// use the siblings data to populate the render.
	// console.log("No current folder found or current folder has no parent_id");
		tree = currentFolderItems;
	}

	let children:SBLink[] = []

	// Filter out the root page from its "children"
	children = currentFolderItems.filter((item)=> !item.is_startpage)

	console.log({children})

	return tree
};

export const fetchParentAndSiblingLinks = async (
	token: string,
	parentID: number,
	slug: string
): Promise<{
	currentFolderItems: SBLink[];
	parentAndSiblingLinksArray: Link[];
}> => {
	// Get all items in current folder (current page and its siblings or, if current page is a root page, current page and its children)
	const currentFolderItems: SBLink[] = await fetchLinks({
		with_parent: parentID,
	});
	//
	const parentAndSiblingLinksArray = await reUseFetchingLogic(
		slug,
		currentFolderItems
	);
	console.log("parentAndSiblingLinksArray", parentAndSiblingLinksArray);
	return { currentFolderItems, parentAndSiblingLinksArray };
};
export const filterTreeStructure = (
	currentFolderItems: Link[],
	parent: Link
): Link[] => {
	const children = currentFolderItems.filter((childLink) => {
		const isChild =
			childLink.parent_id === parent.id && !childLink.is_startpage;

		return isChild;
	});
	return children;
};
export const reUseFetchingLogic = async (
	slug: string,
	currentFolderItems: Link[],
	children?:Link[]
): Promise<Link[]> => {
	const startsWithLinksArray = await fetchLinks({
		starts_with: slug,
	});

	const currentFolder: Link | undefined = startsWithLinksArray.find(
		(item: Link) => item.is_folder && item.slug === slug
	);

	let parentAndSiblingLinksArray: Link[] = [];

	if (currentFolder && currentFolder.parent_id) {
		parentAndSiblingLinksArray = await fetchLinks({
			with_parent: currentFolder.parent_id,
		});
		if (!(children && children.length > 0)) {
			parentAndSiblingLinksArray.map((parentelse) => {
				const children = filterTreeStructure(
					currentFolderItems,
					parentelse
				);
				parentelse.childLinks = children;
				if (children.length > 0) {
					parentelse.childLinks = children;
				} else {
					parentelse.childLinks = [];
				}
			});
		}
	} else {
		parentAndSiblingLinksArray = currentFolderItems;
	}
	return parentAndSiblingLinksArray;
};
