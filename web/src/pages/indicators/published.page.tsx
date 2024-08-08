import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import { IndicatorListNav } from "@/components/ProductListNav/IndicatorListNav";
import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Last updated date",
	textFilterHeading = "Keyword in title or reference number",
	textFilterLabel = "Keyword or ref number";

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
		<Breadcrumb
			to="/standards-and-indicators/indicators"
			key="/standards-and-indicators/indicators"
		>
			Indicators
		</Breadcrumb>,
	],
	currentBreadcrumb: "Published indicators",
	preheading: "",
	heading: <>Published: Indicators</>,
	title: "Published | Indicators",
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
	textFilterHeading,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'IND28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Published",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "indicators",
});
