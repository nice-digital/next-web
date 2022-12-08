import { type GetServerSideProps } from "next/types";

import {
	IndevEmailEnquiry,
	IndevProcessHomepage,
	IndevProjectTeam,
	ProjectDetail,
	type IndevTimeline,
} from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";

const TimelineTable = ({
	data,
}: Record<string, IndevTimeline | IndevTimeline[]>): JSX.Element => {
	const tableBodyData = arrayify(data);

	return (
		<table className="table table-condensed">
			<tbody>
				<tr>
					<th>Date</th>
					<th>Update</th>
				</tr>
				{tableBodyData.map((item, index) => {
					return (
						<tr key={index}>
							<td>{item.column1}</td>
							<td>{item.column2}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export type InDevelopmentPageProps = {
	indevTimelineItems: IndevTimeline[];
	indevProjectTeamMembers: IndevProjectTeam[];
	indevEmailEnquiries: IndevEmailEnquiry[];
	indevProcessHomepage: IndevProcessHomepage;
	project: Pick<
		ProjectDetail,
		| "title"
		| "summary"
		| "status"
		| "technologyType"
		| "topicSelectionDecision"
		| "process"
		| "idNumber"
	>;
};

export default function InDevelopmentPage({
	indevTimelineItems,
	indevProjectTeamMembers,
	indevEmailEnquiries,
	indevProcessHomepage,
	project,
}: InDevelopmentPageProps): JSX.Element {
	const {
		title,
		summary,
		status,
		technologyType,
		topicSelectionDecision,
		process,
		idNumber,
	} = project;
	return (
		<>
			<h2>{title}</h2>
			<p>{summary}</p>
			<p>Status: {status}</p>
			<p>Technology type: {technologyType}</p>
			<p>Decision: {topicSelectionDecision} </p>
			<p>Reason for decision: TODO</p>
			<p>Process: {process}</p>
			<p>ID number: {idNumber}</p>
			{indevProjectTeamMembers.length > 0 ? (
				<>
					<h3>Project Team</h3>
					{indevProjectTeamMembers.map((member) => {
						return (
							<>
								<dt>{member.column1}</dt>
								<dd>{member.column2}</dd>
							</>
						);
					})}
				</>
			) : null}
			{indevProjectTeamMembers.length > 0 ? (
				<>
					<h3>Email enquiries</h3>
					<span>If you have any queries please email</span>
					<ul>
						{indevEmailEnquiries.map((enquiry) => {
							return (
								<li key={enquiry.item}>
									<a href={`mailto:${enquiry.item}`}>{enquiry.item}</a>
								</li>
							);
						})}
					</ul>
				</>
			) : null}
			<h3>Timeline</h3>
			<TimelineTable data={indevTimelineItems} />
			<p>
				{indevProcessHomepage.description}{" "}
				<a href={indevProcessHomepage.links.self[0].href}>
					{indevProcessHomepage.linkText}
				</a>
			</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	InDevelopmentPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project } = result;

	const {
		title,
		summary,
		status,
		technologyType,
		topicSelectionDecision,
		process,
		idNumber,
	} = project;

	const indevTimeline =
			project.embedded.niceIndevTimelineList.embedded.niceIndevTimeline,
		indevTimelineItems = arrayify(indevTimeline),
		indevProjectTeam =
			project.embedded.niceIndevProjectTeamList.embedded.niceIndevProjectTeam,
		indevProjectTeamMembers = arrayify(indevProjectTeam),
		indevEmailEnquiry =
			project.embedded.niceIndevEmailEnquiryList.embedded.niceIndevEmailEnquiry,
		indevEmailEnquiries = arrayify(indevEmailEnquiry),
		indevProcessHomepage = project.embedded.niceIndevProcessHomepage;

	return {
		props: {
			indevTimelineItems,
			indevProjectTeamMembers,
			indevEmailEnquiries,
			indevProcessHomepage,
			project: {
				title,
				summary,
				status,
				technologyType,
				topicSelectionDecision,
				process,
				idNumber,
			},
		},
	};
};
