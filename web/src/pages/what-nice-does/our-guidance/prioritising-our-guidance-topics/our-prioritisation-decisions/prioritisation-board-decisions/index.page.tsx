import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getProductListPage,
} from "@/components/ProductListPage/ProductListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Meeting date",
	textFilterHeading = "Topic title and rationale",
	textFilterLabel = "Topic title and rationale";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of priorition board decisions
		</caption>
		<thead>
			<tr>
				<th scope="col">Meeting date</th>
				<th scope="col">Topic title and rationale</th>
				<th scope="col">Prioritisation decision</th>
				<th scope="col">Prioritisation programme</th>
				<th scope="col">Decision publication date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					prioritisationBoardMeetingDate,
					pathAndQuery,
					title,
					prioritisationDecision,
					prioritisationProgramme,
					prioritisationBoardDecisionDate,
				}) => {
					return (
						<tr key={id}>
							<td>
								{prioritisationBoardMeetingDate ? (
									<ResponsiveDate
										isoDateTime={String(prioritisationBoardMeetingDate)}
									/>
								) : (
									<span>Unknown</span>
								)}
							</td>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{prioritisationDecision}</td>
							<td>{prioritisationProgramme}</td>
							<td>
								<ResponsiveDate
									isoDateTime={String(prioritisationBoardDecisionDate)}
								/>
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
		"We have a centralised approach to prioritising our guidance topics. This ensures that we produce guidance that is relevant, timely, accessible, and has demonstrable impact.",
	breadcrumbTrail: [
		<Breadcrumb to="/what-nice-does" key="/what-nice-does">
			What NICE does
		</Breadcrumb>,
		<Breadcrumb
			to="/what-nice-does/our-guidance"
			key="/what-nice-does/our-guidance"
		>
			Our guidance
		</Breadcrumb>,
		<Breadcrumb
			to="/what-nice-does/our-guidance/prioritising-our-guidance-topics"
			key="/what-nice-does/our-guidance/prioritising-our-guidance-topics"
		>
			Prioritising our guidance topics
		</Breadcrumb>,
		<Breadcrumb
			to="/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions"
			key="/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions"
		>
			Our prioritisation decisions
		</Breadcrumb>,
	],
	currentBreadcrumb: "Prioritisation board decisions",
	preheading: "",
	heading: "Prioritisation board decisions",
	title: "Prioritisation board decisions",
	intro: "We have a centralised approach to prioritising our guidance topics.",
	description:
		"This ensures that we produce guidance that is relevant, timely, accessible, and has demonstrable impact.",
	defaultSort: {
		order: defaultSortOrder,
		label: "Meeting date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Topic title and rationale",
	},
	showDateFilter: true,
	useFutureDates: false,
	dateFilterLabel,
	textFilterHeading,
	tableBodyRender,
	navigatorsOrder: ["pde", "ppr"],
	navigatorsToCollapse: [],
	searchInputPlaceholder: "E.g. 'diabetes'",
	variant: true,
	filterSummaryDescription: (
		<>
			Detailed <strong>rational</strong> for each prioritisation decision is
			available via the topic titles in the second column of the table below
		</>
	),
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "prioritisation",
});
