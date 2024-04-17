import React from "react";

import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import {
	getProductListPage,
	getGetServerSidePropsFunc,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.guidanceRefAscending,
	dateFilterLabel = "Last updated date",
	textFilterLabel = "Filter by Guidance Id or keyword";

const tableBodyRender = (documents: (Document & { sectionNumber?: string })[]) => (
	<>
		<caption className="visually-hidden">
			List of research recommendations
		</caption>
		<thead>
			<tr>
				<th scope="col">Recommendation Id</th>
				<th scope="col">Recommendation for research</th>
				<th scope="col">Published date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(({ id, title, guidanceRef, sectionNumber, pathAndQuery, publicationDate }) => {
				const recommendationId = `${guidanceRef}${sectionNumber ? `/${sectionNumber.padStart(2,"0")}` : ""}`;
				return (
					<tr key={id}>
						<td>{recommendationId}</td>
						<td>
							<Link href={pathAndQuery}>
								<span dangerouslySetInnerHTML={{ __html: title }} />
							</Link>
						</td>
						<td><ResponsiveDate isoDateTime={String(publicationDate)} /></td>
					</tr>
				);
			})}
		</tbody>
	</>
);

export default getProductListPage({
	metaDescription: "",
	listNavType: () => null,
	breadcrumbTrail: [],
	currentBreadcrumb: "Research recommendations",
	preheading: "Published",
	heading: <>Research recommendations</>,
	title: "Research recommendations | NICE",
	defaultSort: {
		order: defaultSortOrder,
		label: "Recommendation Id",
	},
	secondarySort: {
		order: SortOrder.dateDescending,
		label: "Published date",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	textFilterLabel,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'IND28' or 'diabetes'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	index: "researchrecs",
});
