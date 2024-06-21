import libSlugify from "@sindresorhus/slugify";

import {
	ProjectStatus,
	type ProjectDetail,
	ProjectGroup,
	ProjectType,
} from "@/feeds/inDev/types";
import {
	ProductGroup,
	ProductTypeAcronym,
	type ProductDetail,
	type ProductLite,
} from "@/feeds/publications/types";

/** A custom exported version of @sindresorhus/slugify we use everywhere in case we introduce custom replacement */
export const slugify = libSlugify;

/**
 * Gets the path, relative to the root, of an indevelopment project overview page.
 *
 * Note: advice projects don't have project pages, so return null.
 *
 * @param project The indev project for which to get the URL
 * @returns The path of the project, relative to the root
 */
export const getProjectPath = (
	project: Pick<
		ProjectDetail,
		"projectGroup" | "status" | "reference" | "projectType"
	>
): string | null => {
	let groupSlug: string | null;

	switch (project.projectGroup) {
		case ProjectGroup.Guideline:
		case ProjectGroup.Guidance:
		case ProjectGroup.Standard:
			groupSlug = "guidance";
			break;
		case ProjectGroup.Advice:
			return null;
		case ProjectGroup.Other:
			if (project.projectType == ProjectType.IND) groupSlug = "indicators";
			else if (project.projectType === ProjectType.HUB) groupSlug = "hub";
			else groupSlug = "guidance";
			break;
		default:
			throw `Unsupported project type ${project.projectType} ${JSON.stringify(
				project
			)}`;
	}

	let statusSlug = "indevelopment";

	if (project.status == ProjectStatus.Proposed)
		statusSlug = "awaiting-development";
	else if (project.status == ProjectStatus.TopicSelection)
		statusSlug = "topic-selection";
	else if (project.status == ProjectStatus.Discontinued)
		statusSlug = "discontinued";

	return `/${groupSlug}/${statusSlug}/${project.reference.toLowerCase()}`;
};

export const getProductSlug = (
	product: Pick<ProductLite, "id" | "productType" | "title">
): string =>
	product.productType === ProductTypeAcronym.IND
		? `${product.id.toLowerCase()}-${slugify(product.title)}`
		: product.id.toLowerCase();

/**
 * Gets the path, relative to the root, of an published product overview page.
 *
 * @param product The product for which to get the URL
 * @returns The path of the product, relative to the root
 */
export const getProductPath = (
	product: Pick<ProductLite, "productGroup" | "id" | "productType" | "title">
): string => {
	let rootPath: string;

	switch (product.productGroup) {
		case ProductGroup.Guideline:
		case ProductGroup.Guidance:
		case ProductGroup.Standard:
			rootPath = "guidance";
			break;
		case ProductGroup.Advice:
			rootPath = "advice";
			break;
		case ProductGroup.Corporate:
			// There are 2 types of corporate products that have different URLs: corporate vs process and methods
			rootPath =
				product.productType === ProductTypeAcronym.ECD
					? "corporate"
					: "process";
			break;
		case ProductGroup.Other:
			if (product.productType !== ProductTypeAcronym.IND)
				throw Error(
					`Unsupported 'other' product type of ${product.productType}`
				);
			rootPath = "indicators";
			break;
		default:
			throw `Unsupported product group ${product.productGroup} ${JSON.stringify(
				product
			)}`;
	}

	return `/${rootPath}/${getProductSlug(product)}`;
};

export const getPublicationPdfDownloadPath = (
	product: ProductDetail,
	productGroup: ProductGroup,
	lastModified: string
): string | null => {
	if (!product.embedded.contentPartList?.embedded.uploadAndConvertContentPart)
		return null;

	const rootPath = getProductPath({
		...product,
		productGroup,
	});

	return `${rootPath}/${product.id}-${lastModified
		.slice(0, 10)
		.replace(/-/g, "")}.pdf`;
};
