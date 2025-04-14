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

// Get all items in current folder (current page and its siblings)
const currentFolderItems = await fetchLinks({with_parent: parentID});
// Get all items starting with the current slug - this is the only way to access the current folder object
const startingWithCurrentSlugItems = await fetchLinks({starts_with: slug});
// Get currentFolder object so we can access its parent_id
const currentFolder = startingWithCurrentSlugItems.find((item)=> item.is_folder && item.slug === slug);

const grandparentFolderChildren = await fetchLinks({with_parent: currentFolder?.parent_id});



let tree = []

	if(currentFolder && currentFolder.parent_id) {
		tree = grandparentFolderChildren
	} else {
		// When on a top-level slug (like "implementing-nice-guidance"), we
	// use the siblings data to populate the render.
	// console.log("No current folder found or current folder has no parent_id");
		tree = currentFolderItems;
	}

	let children:SBLink[] = []//anything in currentFolderItems with is_startpage != true;

	children = currentFolderItems.filter((item)=> !item.is_startpage)

	console.log({children})

	return tree
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
	children?:Link[]
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
		if (!children.length > 0) {
			grandparentFolderChildren.map((parentelse) => {
				const children = filterTreeStructure(
					siblingsLinksArray,
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
		grandparentFolderChildren = siblingsLinksArray;
	}
	return grandparentFolderChildren;
};
