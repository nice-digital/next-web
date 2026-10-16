import { Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Document, SortOrder } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getListPage,
} from "@/components/Guidance/ListPage/ListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";
import { publicRuntimeConfig } from "@/config";

const defaultSortOrder = SortOrder.dateDescending,
	dateFilterLabel = "Consultation end date",
	textFilterHeading = "Keyword or reference number",
	textFilterLabel = "Keyword or reference number";

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Guidance and quality standards in consultation
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Consultation</th>
				<th scope="col">Type</th>
				<th scope="col">{dateFilterLabel}</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					consultationType,
					pathAndQuery,
					niceResultType,
					consultationEndDate,
				}) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={publicRuntimeConfig.baseURL + pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{consultationType}</td>
							<td>{niceResultType}</td>
							<td>
								<ResponsiveDate isoDateTime={String(consultationEndDate)} />
							</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getListPage({
	metaDescription:
		"See a complete list of all our guidance and quality standards currently open for consultation",
	breadcrumbTrail: [
		<Breadcrumb to="/guidance" key="NICE guidance">
			NICE guidance
		</Breadcrumb>,
	],
	currentBreadcrumb: "In consultation",
	preheading: "",
	heading: "In consultation: Guidance and quality standards",
	title: "Guidance and quality standards in consultation | Guidance",
	defaultSort: {
		order: defaultSortOrder,
		label: "Date",
	},
	secondarySort: {
		order: SortOrder.titleAscending,
		label: "Title",
	},
	showDateFilter: true,
	dateFilterLabel,
	textFilterHeading,
	useFutureDates: true,
	navigatorsOrder: ["ndt", "ngt", "aty"],
	navigatorsToCollapse: ["ndt"],
	tableBodyRender,
	searchInputPlaceholder: "E.g. 'diabetes' or 'NG28'",
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In consultation",
	defaultSortOrder,
	dateFilterLabel,
	textFilterLabel,
	index: "guidance",
});
