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
	project.ProjectGroup == ProductGroup.Advice
		? null
		: project.Status === ProjectStatus.Proposed
		? `/guidance/proposed/${project.Reference.toLowerCase()}`
		: `/guidance/indevelopment/${project.Reference.toLowerCase()}`;

/**
 * Gets the path, relative to the root, of an published product overview page.
 *
 * @param product The product for which to get the URL
 * @returns The path of the product, relative to the root
 */
export const getProductPath = (product: ProductLite): string => {
	let productPath: string;

	switch (product.ProductGroup) {
		case "Guideline":
		case "Guidance":
		case "Standard":
			productPath = "guidance";
			break;
		case "Advice":
			productPath = "advice";
			break;
		case "Corporate":
			// There are 2 types of corporate products that have different URLs: corporate vs process and methods
			productPath =
				product.ProductType === ProductTypeAcronym.ECD
					? "corporate"
					: "process";
			break;
		default:
			throw `Unsupported product group ${product.ProductGroup}`;
	}

	return `/${productPath}/${product.Id.toLowerCase()}`;
};
