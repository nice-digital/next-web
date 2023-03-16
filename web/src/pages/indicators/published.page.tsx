import React from "react";

import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import { IndicatorListNav } from "@/components/ProductListNav/IndicatorListNav";
import {
	getProductListPage,
	getGetServerSidePropsFunc,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Last updated date";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">List of published indicators</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Reference number</th>
				<th scope="col">Published</th>
				<th scope="col">Last updated</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					guidanceRef,
					publicationDate,
					lastUpdated,
					pathAndQuery,
				}) => {
					return (
						<tr key={id}>
							<td>
								<Link href={pathAndQuery}>
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</Link>
							</td>
							<td>{guidanceRef}</td>
							<td>
								<ResponsiveDate isoDateTime={String(publicationDate)} />
							</td>
							<td>
								<ResponsiveDate isoDateTime={String(lastUpdated)} />
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
		"The complete list of all our published indicators, for measuring outcomes that reflect the quality of care or processes, linked by evidence to improved outcomes.",
	listNavType: IndicatorListNav,
	breadcrumbTrail: [
		<Breadcrumb to="/standards-and-indicators" key="standards-and-indicators">
			Standards and Indicators
		</Breadcrumb>,
		<Breadcrumb
			to="/standards-and-indicators/indicators"
			key="/standards-and-indicators/indicators"
		>
			Indicators
		</Breadcrumb>,
	],
	currentBreadcrumb: "Published indicators",
	preheading: "Published",
	heading: <>Indicators</>,
	intro: (
		<>
			<p>
				The NICE indicator menu includes general practice and CCG level
				indicators by clinical area. Use the filters to display indicators by
				type or subject - or filter by both, for more specific results.
			</p>
			<p>
				<a href="/standards-and-indicators">About NICE Indicators</a>
			</p>
		</>
	),
	title: "Published | Indicators | Standards and indicators | NICE",
	defaultSort: {
		order: defaultSortOrder,
		label: "Date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Title",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Published",
	defaultSortOrder,
	dateFilterLabel,
	index: "indicators",
});
