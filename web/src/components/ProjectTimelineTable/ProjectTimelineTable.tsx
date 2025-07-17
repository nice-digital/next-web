import { IndevTimeline } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";

import styles from "./projectTimelineTable.module.scss";

export const Timeline = ({
	data,
}: Record<string, IndevTimeline | IndevTimeline[]>): JSX.Element => {
	const tableBodyData = arrayify(data);

	return (
		<>
			<h3>Timeline</h3>
			<p>Key events during the development of the guidance:</p>
			<table className={styles.tableColumn} aria-label="Timeline">
				<tbody>
					<tr>
						<th>Date</th>
						<th>Update</th>
					</tr>
					{tableBodyData.map((item, index) => {
						return (
							<tr key={index}>
								<td>{item.column1}</td>
								<td
									key={`timelinecell_${index}`}
									dangerouslySetInnerHTML={{ __html: item.column2 }}
								/>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
};
