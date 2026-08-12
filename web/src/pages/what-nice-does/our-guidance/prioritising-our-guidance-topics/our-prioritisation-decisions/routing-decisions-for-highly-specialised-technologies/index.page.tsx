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
			List of routing decisions for highly specialised technologies
		</caption>
		<thead>
			<tr>
				<th scope="col">Meeting date</th>
				<th scope="col">Topic title and rationale</th>
				<th scope="col">Routing decision</th>
				<th scope="col">Rationale</th>
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
					routingDecision,
					rationale,
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
							<td>{routingDecision}</td>
							{rationale ? (
								<td
									dangerouslySetInnerHTML={{
										__html: rationale,
									}}
								></td>
							) : (
								<td>No rationaleText</td>
							)}
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
		"Technologies will be considered eligible for routing to the HST Programme if the NICE prioritisation board agrees that all 4 routing criteria have been met.",
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
	currentBreadcrumb: "Routing decisions for highly specialised technologies",
	preheading: "",
	heading: "Routing decisions for highly specialised technologies",
	title: "Routing decisions for highly specialised technologies",
	intro: (
		<>
			Technologies will be considered eligible for routing to the HST Programme
			if the{" "}
			<a href="https://www.nice.org.uk/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions">
				NICE prioritisation board
			</a>{" "}
			agrees that all{" "}
			<a href="https://www.nice.org.uk/process/pmg46/resources/highly-specialised-technologies-nice-prioritisation-board-routing-criteria-15301445581/chapter/hst-routing-criteria">
				4 routing criteria
			</a>{" "}
			have been met.
		</>
	),
	description: "",
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
	navigatorsOrder: ["rde"],
	navigatorsToCollapse: [],
	searchInputPlaceholder: "E.g. 'diabetes'",
	variant: true,
	filterSummaryDescription: (
		<>Select a topic title to read why the prioritisation decision was made.</>
	),
});

export const getServerSideProps = getGetServerSidePropsFunc({
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "routing",
});
