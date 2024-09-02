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
	preheading: "",
	heading: <>Published: Recommendations for research</>,
	intro: (
		<>
			As we develop guidance, we identify gaps, uncertainties or conflicts in
			the existing evidence base which could benefit from further research. The
			most important unanswered questions are developed into recommendations for
			research.
			<br />
			<br />
			Read our{" "}
			<a href="https://www.nice.org.uk/process/pmg45">
				recommendations for research process and methods guide
			</a>
			. For more information email{" "}
			<a href="mailto:research@nice.org.uk">research@nice.org.uk</a>.
			<br />
			<br />
			<a href="https://www.nihr.ac.uk/">
				National Institute for Health and Care Research (NIHR)
			</a>
			<br />
			<br />
			NICE meets regularly with NIHR to share information about our respective
			research priorities, and seeks NIHR’s input to ensure our recommendations
			for research are clear and actionable. We also work closely to fast-track,
			co-produce and advertise research briefs which are jointly agreed as key
			priorities. In addition to these fast-tracked key priorities, NIHR also
			reviews all NICE guidance and advertises research calls against NICE
			research recommendations through individual programme commissioned
			workstreams. NIHR has been screening NICE guidance for nearly 20 years to
			identify topics suitable for commissioning research. In 2021, NIHR
			launched a researcher-led{" "}
			<a href="https://www.nihr.ac.uk/documents/nihr-nice-rolling-call/27517">
				rolling funding call
			</a>
			, which will complement existing commissioning workstreams. The rolling
			research call aims to build on the success of the relationship between
			NIHR and NICE, and further develop the evidence base supporting guidance
			development.
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
	searchInputPlaceholder: "E.g. 'diabetes' or 'CG100-1'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "researchrecs",
});
