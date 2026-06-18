import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import {
	getGetServerSidePropsFunc,
	getPrioritisationListPage,
} from "@/components/PrioritisationListPage/PrioritisationListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Prioritisation board meeting date",
	textFilterHeading = "Topic title",
	textFilterLabel = "Topic title";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			List of priorition board decisions
		</caption>
		<thead>
			<tr>
				<th scope="col">Prioritisation board meeting date</th>
				<th scope="col">Topic title</th>
				<th scope="col">Prioritisation decision</th>
				<th scope="col">Rationale</th>
				<th scope="col">Prioritisation programme</th>
				<th scope="col">Decision publication date</th>
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
							<td>todo: pb meeting date</td>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>todo: prioritisation decsion</td>
							<td>todo: rationale</td>
							<td>todo: prioritisation programme</td>
							<td>todo: decision publication date</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getPrioritisationListPage({
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
	heading: <>Prioritisation board decisions</>,
	title: "Prioritisation board decisions",
	intro1:
		"We have a centralised approach to prioritising our guidance topics.",
	intro2:
		"This ensures that we produce guidance that is relevant, timely, accessible, and has demonstrable impact.",
	description:
		"",
	defaultSort: {
		order: defaultSortOrder,
		label: "Prioritisation board meeting date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Topic title",
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
