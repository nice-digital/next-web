import { SortOrder, Document } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getGuidanceListPage,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.titleAscending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			In development guidance and quality standards
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Type</th>
				<th scope="col">Expected publication date</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(
				({
					id,
					title,
					pathAndQuery,
					niceResultType,
					expectedPublicationDate,
				}) => {
					return (
						<tr key={id}>
							<td>
								<a
									href={pathAndQuery}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							</td>
							<td>{niceResultType}</td>
							<td>
								{expectedPublicationDate ? (
									<ResponsiveDate isoDateTime={expectedPublicationDate} />
								) : (
									<abbr title="To be confirmed">TBC</abbr>
								)}
							</td>
						</tr>
					);
				}
			)}
		</tbody>
	</>
);

export default getGuidanceListPage({
	breadcrumb: "In development",
	preheading: "Guidance, NICE advice and quality standards ",
	heading: "In development",
	title: "Guidance, NICE advice and quality standards in development",
	defaultSortOrder,
	showDateFilter: true,
	dateFilterLabel: "Expected publication date",
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In development",
	defaultSortOrder,
});
