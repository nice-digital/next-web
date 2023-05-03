import { FC } from "react";

import { formatDateStr } from "@/utils/datetime";

import styles from "./ResponsiveDate.module.scss";

export interface ResponsiveDateProps {
	isoDateTime: string;
}

/**
 * Displays the full NICE date format on wider screens and the NICE short datetime on smaller screens
 *
 * @param isoDateTime String The date time in an ISO format
 * @returns A time tag with the date
 */
export const ResponsiveDate: FC<ResponsiveDateProps> = ({ isoDateTime }) => (
	<time
		className={styles.date}
		dateTime={isoDateTime}
		data-shortdate={formatDateStr(isoDateTime, true)}
	>
		<span>{formatDateStr(isoDateTime)}</span>
	</time>
);
