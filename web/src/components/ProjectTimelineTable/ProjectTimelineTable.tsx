import { IndevTimeline } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";

export const TimelineTable = ({
	data,
}: Record<string, IndevTimeline | IndevTimeline[]>): JSX.Element => {
	const tableBodyData = arrayify(data);

	return (
		<table className="table table-condensed" aria-label="Timeline">
			<tbody>
				<tr>
					<th>Date</th>
					<th>Update</th>
				</tr>
				{tableBodyData.map((item, index) => {
					return (
						<tr key={index}>
							<td>{item.column1}</td>
							<td>{item.column2}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
