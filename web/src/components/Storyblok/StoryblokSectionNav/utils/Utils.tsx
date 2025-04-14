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

// export const fetchLinksFromStoryblok = async (
// 	queryParams: Record<string, string>
// ): Promise<Link[]> => {
// 	const queryString = new URLSearchParams(queryParams).toString();
// 	const res = await fetch(
// 		`https://api.storyblok.com/v2/cdn/links?${queryString}`
// 	);
// 	const data = await res.json();
// 	const dataArray: Link[] = Object.values(data.links);
// 	return dataArray;
// };
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
		// version: "published",
		// token,
		with_parent: parentID,
		// per_page: 1000,
	});
	const parentAndSiblingLinksArray = await reUseFetchingLogic(
		token,
		slug,
		siblingsLinksArray
	);
	console.log("parentAndSiblingLinksArray", parentAndSiblingLinksArray);
	return { siblingsLinksArray, parentAndSiblingLinksArray };
};
export const filterFunctionForTreeStructure = (
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
export const reUseFetchingLogic = async (
	token: string,
	slug: string,
	siblingsLinksArray: Link[],
	secondIteration?: boolean
): Promise<Link[]> => {
	const startsWithLinksArray = await fetchLinks({
		// version: "published",
		// token,
		starts_with: slug,
		// per_page: 1000,
	});

	const currentFolderLink: Link | undefined = startsWithLinksArray.find(
		(item: Link) => item.is_folder && item.slug === slug
	);

	let parentAndSiblingLinksArray: Link[] = [];

	if (currentFolderLink && currentFolderLink.parent_id) {
		parentAndSiblingLinksArray = await fetchLinks({
			// version: "published",
			// token,
			with_parent: currentFolderLink.parent_id,
			per_page: 1000,
		});
		if (secondIteration) {
			parentAndSiblingLinksArray.map((parentelse) => {
				const children = filterFunctionForTreeStructure(
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
		parentAndSiblingLinksArray = siblingsLinksArray;
	}
	return parentAndSiblingLinksArray;
};
