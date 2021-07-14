import dayjs from "dayjs";
import { Project, ProjectStatus } from "@/feeds/inDev/types";
import { ProductGroup } from "@/feeds/publications/types";

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
 * The standard 'NICE' format for dates as per the NICE style guide at
 * https://www.nice.org.uk/corporate/ecd1/chapter/numbers-units-and-symbols#units
 */
export const niceDateFormat = "DD MMMM YYYY";

/**
 * Formats the given ISO date string into a standard NICE string format
 *
 * @param isoDateStr the ISO date string for format
 * @returns The formatted date
 */
export const formatDateStr = (isoDateStr: string): string =>
	dayjs(isoDateStr).format(niceDateFormat);

/**
 * Gets the relative path, relative to the root, of an indevelopment project overview page.
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
