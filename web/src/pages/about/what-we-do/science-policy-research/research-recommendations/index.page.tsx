import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.guidanceRefAscending,
	dateFilterLabel = "Published date",
	textFilterLabel = "Filter by reference number or keyword";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of research recommendations
		</caption>
		<thead>
			<tr>
				<th scope="col">Reference number</th>
				<th scope="col">Recommendation for research</th>
				<th scope="col">Published</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({ id, title, guidanceRef, pathAndQuery, publicationDate }) => {
					return (
						<tr key={id}>
							<td>{guidanceRef}</td>
							<td>
								<Link href={pathAndQuery}>
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</Link>
							</td>
							<td>
								<ResponsiveDate isoDateTime={String(publicationDate)} />
							</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getProductListPage({
	metaDescription: "",
	listNavType: () => null,
	breadcrumbTrail: [
		<Breadcrumb to="/about" key="About">
			About
		</Breadcrumb>,
		<Breadcrumb to="/about/what-we-do" key="What we do">
			What we do
		</Breadcrumb>,
		<Breadcrumb
			to="/about/what-we-do/research-and-development"
			key="Research and development"
		>
			Research and development
		</Breadcrumb>,
	],
	currentBreadcrumb: "Research recommendations",
	preheading: "Published",
	heading: <>Research recommendations</>,
	title: "Research recommendations | NICE",
	defaultSort: {
		order: defaultSortOrder,
		label: "Reference number",
	},
	secondarySort: {
		order: SortOrder.dateDescending,
		label: "Published",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	textFilterLabel,
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'CG100/1' or 'diabetes'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	index: "researchrecs",
});
