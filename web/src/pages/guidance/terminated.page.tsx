import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/ProductListNav/GuidanceListNav";
import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Terminated date",
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">Terminated</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Guidance programme</th>
				<th scope="col">Terminated date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({ id, title, pathAndQuery, guidanceProgramme, terminatedDate }) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{guidanceProgramme || "n/a"}</td>
							<td>
								{terminatedDate ? (
									<ResponsiveDate isoDateTime={terminatedDate} />
								) : (
									<abbr title="To be confirmed">TBC</abbr>
								)}
							</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getProductListPage({
	metaDescription: "Find out what guidance has been terminated",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "Terminated",
	preheading: "",
	heading: "Terminated",
	title: "Terminated | Guidance",
	defaultSort: {
		order: defaultSortOrder,
		label: "Terminated date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Title",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	textFilterHeading,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'NG28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Terminated",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "guidance",
});
