import { Document, SortOrder } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getGuidanceListPage,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateDescending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Published guidance, NICE advice and quality standards
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Reference number</th>
				<th scope="col">Published</th>
				<th scope="col">Last updated</th>
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
								<a
									href={pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{guidanceRef}</td>
							<td>
								<ResponsiveDate isoDateTime={String(publicationDate)} />
							</td>
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

export default getGuidanceListPage({
	breadcrumb: "Published",
	preheading: "Published ",
	heading: <>Guidance, NICE advice and quality&nbsp;standards</>,
	title: "Published guidance, NICE advice and quality standards",
	defaultSortOrder,
	showDateFilter: true,
	dateFilterLabel: "Last updated date",
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Published",
	defaultSortOrder,
});
