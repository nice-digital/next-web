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
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of indicators that are in development
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
					resourceType,
					expectedPublicationDate,
					pathAndQuery,
				}) => {
					return (
						<tr key={id}>
							<td>
								<Link href={pathAndQuery}>
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</Link>
							</td>
							<td>
								{resourceType.length <= 1 ? (
									resourceType[0]
								) : (
									<>
										{resourceType.map((resource) => (
											<>{resource}. </>
										))}
									</>
								)}
							</td>
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
		"View a complete list of indicators currently being developed. Our indicators measure outcomes that reflect the quality of care or processes.",
	listNavType: IndicatorListNav,
	breadcrumbTrail: [
		<Breadcrumb
			to="/standards-and-indicators/indicators"
			key="/standards-and-indicators/indicators"
		>
			Indicators
		</Breadcrumb>,
	],
	currentBreadcrumb: "In development",
	preheading: "",
	heading: <>In development: Indicators</>,
	title: "In development | Indicators",
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
	textFilterHeading,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'IND28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In development",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "indicators",
});
