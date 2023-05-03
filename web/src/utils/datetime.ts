import dayjs from "dayjs";

/**
 * The 'NICE' date format, as per the NICE style guide: "For dates, use the format 4 September 2009"
 *
 * @see https://www.nice.org.uk/corporate/ecd1/chapter/numbers-units-and-symbols
 */
export const dateFormat = "D MMMM YYYY";

/**
 * The 'short' 'NICE' date format, as per the NICE style guide: "The format 4/9/2009 is okay to save space in a table"
 *
 * @see https://www.nice.org.uk/corporate/ecd1/chapter/numbers-units-and-symbols
 */
export const dateFormatShort = "D/M/YYYY";

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
