import { type GetServerSideProps } from "next/types";

import { type IndevTimeline } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";

const TimelineTable = ({
	data,
}: Record<string, IndevTimeline | IndevTimeline[]>): JSX.Element => {
	const tableBodyData = arrayify(data);

	tableBodyData.map((item) => {
		console.log(item);
	});

	return (
		<table className="table table-condensed">
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

export type InDevelopmentPageProps = {
	someProjectProperty: string;
	indevTimelineItems: IndevTimeline[];
};

export default function InDevelopmentPage({
	indevTimelineItems,
}: InDevelopmentPageProps): JSX.Element {
	// console.log({ indevTimelineItems });
	return (
		<>
			<p>Indicator in development</p>
			<h3>Timeline</h3>

			<TimelineTable data={indevTimelineItems} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	InDevelopmentPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project } = result;

	const indevTimeline =
		project.embedded.niceIndevTimelineList.embedded.niceIndevTimeline;

	const indevTimelineItems = arrayify(indevTimeline);

	return {
		props: {
			someProjectProperty: "some prop",
			indevTimelineItems,
		},
	};
};
