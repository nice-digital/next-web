import { SortOrder, Document } from "@nice-digital/search-client";

import {
	getGuidanceListPage,
	getGetServerSidePropsFunc,
} from "@/components/GuidanceListPage/GuidanceListPage";

const defaultSortOrder = SortOrder.titleAscending;

const tableBodyRender = (documents: Document[]) => (
	<>
		<caption className="visually-hidden">
			Guidance and quality standards awaiting development
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
	metaDescription:
		"Find out which guidance and quality standards are awaiting development",
	navItems: [
		{ path: "/guidance/published", text: "Published" },
		{ path: "/guidance/inconsultation", text: "In consultation" },
		{ path: "/guidance/indevelopment", text: "In development" },
		{
			path: "/guidance/awaiting-development",
			text: "Awaiting development",
		},
		{ path: "/guidance/topic-selection", text: "Topic selection" },
	],
	breadcrumbsTrail: [
		{ path: "/", text: "Home" },
		{ path: "/guidance", text: "NICE guidance" },
		{ path: "/guidance/awaiting-development", text: "Awaiting development" },
	],
	preheading: "Guidance and quality standards ",
	heading: "Awaiting development",
	title: "Guidance and quality standards awaiting development",
	defaultSort: {
		order: defaultSortOrder,
		label: "Title",
	},
	showDateFilter: false,
	tableBodyRender,
});

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "Awaiting development",
	defaultSortOrder,
	index: "guidance",
});
