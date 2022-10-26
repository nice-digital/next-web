import slugify from "@sindresorhus/slugify";
import dayjs from "dayjs";

import { Project, ProjectStatus } from "@/feeds/inDev/types";
import {
	ProductGroup,
	ProductLite,
	ProductTypeAcronym,
} from "@/feeds/publications/types";

import { dateFormat, dateFormatShort } from "./constants";

/**
 * Returns a a sortable date with just year, month and date (without time).
 * We never expose times to users so it makes sense to just sort by date instead.
 *
 * @param isoDateStr The full date string with timezone e.g. `2021-05-21T10:54:52.4655487`
 * @returns The sortable date, without the timezone e.g. `2021-05-21`
 */
export const stripTime = (isoDateStr: string): string =>
	isoDateStr.substring(0, isoDateStr.indexOf("T"));

/**
 * Formats the given ISO date string into a standard NICE string format
 *
 * @param isoDateStr the ISO date string for format
 * @param short whether to format the date in the standard short format
 * @returns The formatted date
 */
export const formatDateStr = (isoDateStr: string, short = false): string =>
	dayjs(isoDateStr).format(short ? dateFormatShort : dateFormat);

/**
 * Gets the path, relative to the root, of an indevelopment project overview page.
 *
 * Note: advice projects don't have project pages, so return null.
 *
 * @param project The indev project for which to get the URL
 * @returns The path of the project, relative to the root
 */
export const getProjectPath = (project: Project): string | null =>
	project.projectGroup == ProductGroup.Advice
		? null
		: project.status === ProjectStatus.Proposed
		? `/guidance/awaiting-development/${project.reference.toLowerCase()}`
		: `/guidance/indevelopment/${project.reference.toLowerCase()}`;

/**
 * Gets the path, relative to the root, of an published product overview page.
 *
 * @param product The product for which to get the URL
 * @returns The path of the product, relative to the root
 */
export const getProductPath = (
	product: Pick<ProductLite, "productGroup" | "id" | "productType" | "title">
): string => {
	let rootPath: string,
		productSlug = product.id.toLowerCase();

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
			productSlug += `-${slugify(product.title)}`;
			break;
		default:
			throw `Unsupported product group ${product.productGroup} ${JSON.stringify(
				product
			)}`;
	}

	return `/${rootPath}/${productSlug}`;
};
