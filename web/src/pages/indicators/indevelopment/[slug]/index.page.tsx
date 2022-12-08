import { type GetServerSideProps } from "next/types";

import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { TimelineTable } from "@/components/ProjectTimelineTable/ProjectTimelineTable";
import {
	type IndevEmailEnquiry,
	type IndevProcessHomepage,
	type IndevProjectTeam,
	type IndevSchedule,
	type IndevTimeline,
} from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";

export type InDevelopmentPageProps = {
	indevScheduleItems?: IndevSchedule[];
	indevTimelineItems?: IndevTimeline[];
	indevProjectTeamMembers?: IndevProjectTeam[];
	indevEmailEnquiries?: IndevEmailEnquiry[];
	indevProcessHomepage?: IndevProcessHomepage;
	title: string;
	summary: string | null;
	status: string;
	technologyType: string | null;
	topicSelectionDecision: string;
	process: string;
	developedAs: string;
	idNumber: string | null;
	reference: string;
};

export default function InDevelopmentPage({
	indevScheduleItems,
	indevTimelineItems,
	indevProjectTeamMembers,
	indevEmailEnquiries,
	indevProcessHomepage,
	title,
	summary,
	status,
	technologyType,
	topicSelectionDecision,
	process,
	developedAs,
	idNumber,
	reference,
}: InDevelopmentPageProps): JSX.Element {
	const project = { reference, title, status, indevScheduleItems };

	return (
		<>
			<ProjectPageHeading project={project} />
			<p>{summary}</p>
			<p>Status: {status}</p>
			<p>Technology type: {technologyType}</p>
			<p>Decision: {topicSelectionDecision} </p>
			<p>Reason for decision: TODO</p>
			<p>Process: {process}</p>
			<p>Developed as: {developedAs}</p>
			<p>ID number: {idNumber}</p>
			{indevProjectTeamMembers && indevProjectTeamMembers?.length > 0 ? (
				<>
					<h3>Project Team</h3>
					<dl>
						{indevProjectTeamMembers?.map((member) => {
							return (
								<>
									<dt>{member.column1}</dt>
									<dd>{member.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{indevEmailEnquiries && indevEmailEnquiries.length > 0 ? (
				<>
					<h3>Email enquiries</h3>
					<span>If you have any queries please email</span>
					<ul>
						{indevEmailEnquiries &&
							indevEmailEnquiries.map((enquiry) => {
								return (
									<li key={enquiry.item}>
										<a href={`mailto:${enquiry.item}`}>{enquiry.item}</a>
									</li>
								);
							})}
					</ul>
				</>
			) : null}
			{indevScheduleItems && indevScheduleItems.length > 0 ? (
				<>
					<h3>Provisional Schedule</h3>
					<dl>
						{indevScheduleItems?.map((item) => {
							return (
								<>
									<dt>{item.column1}</dt>
									<dd>{item.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{indevTimelineItems && indevTimelineItems.length > 0 ? (
				<>
					<h3>Timeline</h3>
					<p>Key events during the development of the guidance:</p>
					<TimelineTable data={indevTimelineItems} />
				</>
			) : null}
			{indevProcessHomepage ? (
				<p>
					{indevProcessHomepage.description}{" "}
					<a href={indevProcessHomepage.links.self[0].href}>
						{indevProcessHomepage.linkText}
					</a>
				</p>
			) : null}
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
		developedAs,
		idNumber,
		reference,
	} = project;

	const indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevTimeline =
			project.embedded.niceIndevTimelineList?.embedded.niceIndevTimeline,
		indevTimelineItems = arrayify(indevTimeline),
		indevProjectTeam =
			project.embedded.niceIndevProjectTeamList?.embedded.niceIndevProjectTeam,
		indevProjectTeamMembers = arrayify(indevProjectTeam),
		indevEmailEnquiry =
			project.embedded.niceIndevEmailEnquiryList?.embedded
				.niceIndevEmailEnquiry,
		indevEmailEnquiries = arrayify(indevEmailEnquiry);

	let indevProcessHomepage = null;

	if (project.embedded.niceIndevProcessHomepage) {
		indevProcessHomepage = project.embedded.niceIndevProcessHomepage;
	}

	return {
		props: {
			indevScheduleItems,
			indevTimelineItems,
			indevProjectTeamMembers,
			indevEmailEnquiries,
			indevProcessHomepage,
			title,
			summary,
			status,
			technologyType,
			topicSelectionDecision,
			process,
			developedAs,
			idNumber,
			reference,
		},
	};
};
