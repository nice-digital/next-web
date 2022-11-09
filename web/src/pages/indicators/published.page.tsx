import React from "react";

import { Document, SortOrder } from "@nice-digital/search-client";

import {
	getGuidanceListPage,
	getGetServerSidePropsFunc,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Last updated date";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Published guidance, NICE advice and quality standards
		</caption>
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

export default getGuidanceListPage({
	metaDescription: "TODO",
	navItems: [
		{ path: "/indicators/published", text: "Published" },
		{ path: "/indicators/inconsultation", text: "In consultation" },
		{ path: "/indicators/indevelopment", text: "In development" },
	],
	breadcrumbsTrail: [
		{ path: "/", text: "Home" },
		{ path: "/standards-and-indicators", text: "Standards and Indicators" },
		{ path: "/standards-and-indicators/indicators", text: "Indicators" },
		{
			path: "/standards-and-indicators/indicators/published",
			text: "Published",
		},
	],
	preheading: "",
	heading: <>Indicators</>,
	title: "Indicators",
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
