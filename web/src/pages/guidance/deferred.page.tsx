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
	dateFilterLabel = "Deferred date",
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">Deferred</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Deferred ID</th>
				<th scope="col">Guidance programme</th>
				<th scope="col">Deferred date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					deferredDate,
					deferredId,
					id,
					niceResultType,
					pathAndQuery,
					title,
				}) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{deferredId}</td>
							<td>{niceResultType || "n/a"}</td>
							<td>
								{deferredDate ? (
									<ResponsiveDate isoDateTime={deferredDate} />
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
	metaDescription: "Find out what guidance is being considered for development",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "Deferred",
	preheading: "",
	heading: "Deferred",
	title: "Deferred | Guidance",
	defaultSort: {
		order: defaultSortOrder,
		label: "Deferred date",
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
	gstPreFilter: "Deferred",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "guidance",
});
