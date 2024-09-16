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
			As we develop guidance, we identify gaps and uncertainties in the evidence
			base which could benefit from further research. The most important
			unanswered questions are developed into research recommendations.
			<a href="https://www.nice.org.uk/Media/Default/About/what-we-do/Science-policy-and-research/research-recommendation-process-methods-guide-2015.pdf">
				Read our process and methods guide (PDF)
			</a>
			.
			<br />
			<br />
			Browse the list below to find a topic of interest. Published dates
			represent the date the guidance was first published. A year noted at the
			end of a research recommendation title indicates when the research
			recommendation was last published/updated. This is may differ to the
			guidance published date for guidance that’s undergone a partial update.
			Please <a href="mailto:research@nice.org.uk">contact</a> us if you need
			more information.
			<br />
			<br />
			<a href="https://www.nihr.ac.uk/funding/nihr-nice-rolling-call/36180">
				Call for research studies addressing NICE research recommendations
			</a>
			<br />
			The National Institute for Health and Care Research (NIHR) are seeking
			applications to address NICE research recommendations as part of a rolling
			research call.
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
