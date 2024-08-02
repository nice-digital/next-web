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
	dateFilterLabel = "Consultation end date";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of indicators that are currently in consultation
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Consultation</th>
				<th scope="col">{dateFilterLabel}</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					consultationType,
					consultationEndDate,
					pathAndQuery,
				}) => {
					return (
						<tr key={id}>
							<td>
								<Link href={pathAndQuery}>
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</Link>
							</td>
							<td>{consultationType}</td>
							<td>
								<ResponsiveDate isoDateTime={String(consultationEndDate)} />
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
		<Breadcrumb
			to="/standards-and-indicators/indicators"
			key="/standards-and-indicators/indicators"
		>
			Indicators
		</Breadcrumb>,
	],
	currentBreadcrumb: "In consultation",
	preheading: "",
	heading: <>In consultation: Indicators</>,
	title: "In consultation | Indicators",
	defaultSort: {
		order: defaultSortOrder,
		label: "Date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Title",
	},
	showDateFilter: true,
	useFutureDates: true,
	dateFilterLabel,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'IND28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In consultation",
	defaultSortOrder,
	dateFilterLabel,
	index: "indicators",
});
