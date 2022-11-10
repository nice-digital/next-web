import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { SortOrder, Document } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/GuidanceListPage/GuidanceListNav/GuidanceListNav";
import {
	getGuidanceListPage,
	getGetServerSidePropsFunc,
} from "@/components/GuidanceListPage/GuidanceListPage";

const defaultSortOrder = SortOrder.titleAscending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">Guidance in topic selection</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Technology type</th>
				<th scope="col">Decision</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					pathAndQuery,
					technologyType,
					topicSelectionDecision,
				}) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{technologyType || "n/a"}</td>
							<td>{topicSelectionDecision || "n/a"}</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getGuidanceListPage({
	metaDescription: "Find out what guidance is being considered for development",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "Topic selection",
	preheading: "Guidance in ",
	heading: "Topic selection",
	title: "Guidance in topic selection",
	defaultSort: {
		order: defaultSortOrder,
		label: "Title",
	},
	showDateFilter: false,
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Topic selection",
	defaultSortOrder,
	index: "guidance",
});
