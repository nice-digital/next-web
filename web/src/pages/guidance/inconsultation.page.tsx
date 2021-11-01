import { FC } from "react";

import { SortOrder, Document } from "@nice-digital/search-client";

import {
	GuidanceListPage,
	getGetServerSidePropsFunc,
} from "@/components/GuidanceListPage/GuidanceListPage";
import { GuidanceListPageDataProps } from "@/components/GuidanceListPage/GuidanceListPageProps";
import { ResponsiveDate } from "@/components/ResponsiveDate/ResponsiveDate";

const defaultSortOrder = SortOrder.dateAscending,
	dateFilterLabel = "Consultation end date";

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

const InConsultationListPage: FC<GuidanceListPageDataProps> = (
	props: GuidanceListPageDataProps
) => (
	<GuidanceListPage
		{...props}
		metaDescription="A complete list of all guidance and quality standards currently open for consultation"
		breadcrumb="In consultation"
		preheading="Guidance and quality standards "
		heading="In consultation"
		title="Guidance and quality standards in consultation"
		defaultSort={{
			order: defaultSortOrder,
			label: "Date",
		}}
		secondarySort={{
			order: SortOrder.titleAscending,
			label: "Title",
		}}
		showDateFilter={true}
		dateFilterLabel={dateFilterLabel}
		useFutureDates={true}
		tableBodyRender={tableBodyRender}
	/>
);

export default InConsultationListPage;

export const getServerSideProps = getGetServerSidePropsFunc({
	gstPreFilter: "In consultation",
	defaultSortOrder,
	dateFilterLabel,
});
