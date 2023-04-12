import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { SortOrder, Document } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/ProductListNav/GuidanceListNav";
import {
	getProductListPage,
	getGetServerSidePropsFunc,
} from "@/components/ProductListPage/ProductListPage";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.titleAscending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Guidance and quality standards awaiting development
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Type</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(({ id, title, pathAndQuery, niceResultType }) => {
				return (
					<tr key={id}>
						<td>
							<a
								href={publicRuntimeConfig.baseURL + pathAndQuery}
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						</td>
						<td>{niceResultType}</td>
					</tr>
				);
			})}
		</tbody>
	</>
);

export default getProductListPage({
	metaDescription:
		"Find out which guidance and quality standards are awaiting development",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "Awaiting development",
	preheading: "Guidance and quality standards ",
	heading: "Awaiting development",
	title: "Guidance and quality standards awaiting development",
	defaultSort: {
		order: defaultSortOrder,
		label: "Title",
	},
	showDateFilter: false,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'NG28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Awaiting development",
	defaultSortOrder,
	index: "guidance",
});
