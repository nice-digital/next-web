import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Published",
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of research recommendations
		</caption>
		<thead>
			<tr>
				<th scope="col">Recommendation for research</th>
				<th scope="col">Reference number</th>
				<th scope="col">Published</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({ id, title, guidanceRef, pathAndQuery, publicationDate }) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{guidanceRef}</td>
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
		<Breadcrumb to="/what-nice-does" key="What NICE does">
			What NICE does
		</Breadcrumb>,
		<Breadcrumb to="/what-nice-does/our-research-work" key="Our research work">
			Our research work
		</Breadcrumb>,
	],
	currentBreadcrumb: "Research recommendations",
	preheading: "",
	heading: <>Published: Recommendations for research</>,
	intro: (
		<>
			As we develop guidance, we identify gaps and uncertainties in the evidence
			base which could benefit from further research. The most important
			unanswered questions are developed into research recommendations.
		</>
	),
	description: (
		<>
			Browse the list below to identify research priorities across NICE
			guidance. For more information about how NICE develops research
			recommendations,{" "}
			<a
				href="https://www.nice.org.uk/process/pmg45"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="read our process and methods guide (opens in a new window)"
				title="read our process and methods guide (opens in a new window)"
			>
				read our process and methods guide
			</a>
			. To learn more about funding opportunities available to address NICE
			research recommendations, please visit the{" "}
			<a
				href="https://www.nihr.ac.uk/nihr-nice-rolling-call-specification-document"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="NIHR-NICE rolling call (opens in a new window)"
				title="NIHR-NICE rolling call (opens in a new window)"
			>
				NIHR-NICE rolling call
			</a>
			.
			<br />
			<br />
			For further information email{" "}
			<a
				href="mailto:research@nice.org.uk"
				aria-label="Email the NICE research team at research@nice.org.uk"
			>
				research@nice.org.uk
			</a>
			.
		</>
	),
	title: "Research recommendations | NICE",
	defaultSort: {
		order: defaultSortOrder,
		label: "Published",
	},
	secondarySort: {
		order: SortOrder.guidanceRefAscending,
		label: "Reference number",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	textFilterHeading,
	tableBodyRender,
	navigatorsOrder: ["ndt", "ngt", "aty"],
	searchInputPlaceholder: "E.g. 'diabetes' or 'CG100-1'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "researchrecs",
});
