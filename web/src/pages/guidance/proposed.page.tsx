import { FC } from "react";

import { SortOrder, Document } from "@nice-digital/search-client";

import {
	GuidanceListPage,
	getGetServerSidePropsFunc,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { GuidanceListPageDataProps } from "@/components/GuidanceListPage/GuidanceListPageProps";

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

const ProposedListPage: FC<GuidanceListPageDataProps> = (
	props: GuidanceListPageDataProps
) => (
	<GuidanceListPage
		{...props}
		metaDescription="A complete list of guidance and quality standards awaiting development"
		breadcrumb="Proposed"
		preheading="Guidance and quality standards "
		heading="Proposed for development"
		title="Proposed guidance and quality standards"
		defaultSort={{
			order: defaultSortOrder,
			label: "Title",
		}}
		showDateFilter={false}
		tableBodyRender={tableBodyRender}
	/>
);

export default ProposedListPage;

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Proposed",
	defaultSortOrder,
});
