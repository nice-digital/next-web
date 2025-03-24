import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/ProductListNav/GuidanceListNav";
import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
// import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.titleAscending,
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

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
								// href={publicRuntimeConfig.baseURL + pathAndQuery}
								href={process.env.PUBLIC_BASE_URL + pathAndQuery}
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
	preheading: "",
	heading: "Awaiting development: Guidance and quality standards",
	title: "Guidance and quality standards awaiting development | Guidance",
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
	gstPreFilter: "Awaiting development",
	textFilterLabel,
	defaultSortOrder,
	index: "guidance",
});
