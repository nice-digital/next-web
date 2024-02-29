import React from "react";

import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import {
	getProductListPage,
	getGetServerSidePropsFunc,
} from "@/components/ProductListPage/ProductListPage";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Last updated date";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of research recommendations
		</caption>
		<thead>
			<tr>
				<th scope="col">Recommendation question</th>
				<th scope="col">Guidance Id</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(({ id, title, guidanceRef, pathAndQuery }) => {
				return (
					<tr key={id}>
						<td>
							<Link href={pathAndQuery}>
								<span dangerouslySetInnerHTML={{ __html: title }} />
							</Link>
						</td>
						<td>{guidanceRef}</td>

						{/* <td
								dangerouslySetInnerHTML={{ __html: metaDescription || "" }}
							></td> */}
						{/* <td>
								<ResponsiveDate isoDateTime={String(publicationDate)} />
							</td>
							<td>
								<ResponsiveDate isoDateTime={String(lastUpdated)} />
							</td> */}
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
	preheading: "",
	heading: <>Research recommendations</>,
	title: "Research recommendations | NICE",
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
	searchInputPlaceholder: "E.g. 'diabetes' or 'IND28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	index: "researchrecs",
});
