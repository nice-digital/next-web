import { SortOrder, Document } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getGuidanceListPage,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateAscending;

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
				<th scope="col">Consultation end date</th>
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
									href={pathAndQuery}
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

export default getGuidanceListPage({
	breadcrumb: "In consultation",
	preheading: "Guidance and quality standards ",
	heading: "In consultation",
	title: "Guidance and quality standards in consultation",
	defaultSortOrder,
	showDateFilter: true,
	dateFilterLabel: "Consultation end date",
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In consultation",
	defaultSortOrder,
});
