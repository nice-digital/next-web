import React from "react";

import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

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
		<caption className="visually-hidden">
			List of indicators that are currently in consultation
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Consultation</th>
				<th scope="col">Type</th>
				<th scope="col">{dateFilterLabel}</th>
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
								<a
									href={pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
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
		"See a complete list of indicators currently in consultation. Our indicators measure outcomes that reflect the quality of care or processes.",
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
	currentBreadcrumb: "In consultation",
	preheading: "In consultation",
	heading: <>Indicators</>,
	title: "In consultation | Indicators | Standards and indicators | NICE",
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
	gstPreFilter: "In consultation",
	defaultSortOrder,
	dateFilterLabel,
	index: "indicators",
});
