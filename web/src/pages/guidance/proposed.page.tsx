import { SortOrder, Document } from "@nice-digital/search-client";

import {
	getGetServerSidePropsFunc,
	getGuidanceListPage,
} from "@/components/GuidanceListPage/GuidanceListPage";

const defaultSortOrder = SortOrder.titleAscending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Proposed guidance and quality standards
		</caption>
		<thead>
			<tr>
				<th scope="col">Title</th>
				<th scope="col">Type</th>
			</tr>
		</thead>
		<tbody>
			{documents.map(({ id, title, pathAndQuery, niceResultType }) => {
				return (
					<tr key={id}>
						<td>
							<a
								href={pathAndQuery}
								dangerouslySetInnerHTML={{ __html: title }}
							/>
						</td>
						<td>{niceResultType}</td>
					</tr>
				);
			})}
		</tbody>
	</>
);

export default getGuidanceListPage({
	breadcrumb: "Proposed",
	preheading: "Guidance and quality standards ",
	heading: "Proposed for development",
	title: "Proposed guidance and quality standards",
	defaultSortOrder,
	showDateFilter: false,
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Proposed",
	defaultSortOrder,
});
