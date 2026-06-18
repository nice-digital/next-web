import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";
import {
	getGetServerSidePropsFunc,
	getPrioritisationListPage,
} from "@/components/PrioritisationListPage/PrioritisationListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Prioritisation board meeting date",
	textFilterHeading = "Topic title",
	textFilterLabel = "Topic title";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">Our prioritisation decisions</caption>
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
							<td>
								<ResponsiveDate isoDateTime={String(publicationDate)} />
							</td>
							<td>
								<Link href={pathAndQuery}>
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</Link>
							</td>
							<td></td>
							<td></td>
							<td></td>
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

export default getPrioritisationListPage({
	metaDescription:
		"We've developed a centralised approach to prioritising our guidance topics. This ensures that we produce guidance that's relevant, timely, accessible, and has demonstrable impact.",
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
	intro:
		"We've developed a centralised approach to prioritising our guidance topics.",
	description:
		"This ensures that we produce guidance that's relevant, timely, accessible, and has demonstrable impact.",
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
	searchInputPlaceholder: "E.g. 'diabetes'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Published",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "indicators",
});
