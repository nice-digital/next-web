import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/ProductListNav/GuidanceListNav";
import {
	getGetServerSidePropsFunc,
	getProductListPage
} from "@/components/ProductListPage/ProductListPage";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.titleAscending,
	textFilterHeading = "Keyword or ref number",
	textFilterLabel = "Keyword or ref number";

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
									href={publicRuntimeConfig.baseURL + pathAndQuery}
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

export default getProductListPage({
	metaDescription: "Find out what guidance is being considered for development",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "Topic selection",
	preheading: "",
	heading: "Guidance in topic selection",
	title: "Guidance in topic selection | Guidance",
	defaultSort: {
		order: defaultSortOrder,
		label: "Title",
	},
	showDateFilter: false,
	textFilterHeading,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'NG28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Topic selection",
	textFilterLabel,
	defaultSortOrder,
	index: "guidance",
});
