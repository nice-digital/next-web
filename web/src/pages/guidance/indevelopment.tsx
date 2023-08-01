import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { SortOrder, Document } from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/ProductListNav/GuidanceListNav";
import {
	getProductListPage,
	getGetServerSidePropsFunc,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.titleAscending,
	dateFilterLabel = "Expected publication date";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Guidance, NICE advice and quality standards in development
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Type</th>
				<th scope="col">Expected publication date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					pathAndQuery,
					niceResultType,
					expectedPublicationDate,
				}) => {
					return (
						<tr key={id}>
							<td>
								{/* In dev advice don't have pages in their own right but search still sends back a fake URL */}
								{pathAndQuery.indexOf("not_a_real_url") > -1 ? (
									<span dangerouslySetInnerHTML={{ __html: title }} />
								) : (
									<a
										href={publicRuntimeConfig.baseURL + pathAndQuery}
										dangerouslySetInnerHTML={{ __html: title }}
									/>
								)}
							</td>
							<td>{niceResultType}</td>
							<td>
								{expectedPublicationDate ? (
									<ResponsiveDate isoDateTime={expectedPublicationDate} />
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
	metaDescription:
		"View a complete list of all our guidance, NICE advice and quality standards currently in development",
	listNavType: GuidanceListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "In development",
	preheading: "Guidance, NICE advice and quality standards ",
	heading: "In development",
	title: "Guidance, NICE advice and quality standards in development",
	defaultSort: {
		order: defaultSortOrder,
		label: "Title",
	},
	secondarySort: {
		order: SortOrder.dateAscending,
		label: "Date",
	},
	showDateFilter: true,
	useFutureDates: true,
	dateFilterLabel,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'NG28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In development",
	defaultSortOrder,
	dateFilterLabel,
	index: "guidance",
});
