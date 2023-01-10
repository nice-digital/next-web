import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ProjectInformation } from "@/components/ProjectInformation/ProjectInformation";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { Stakeholders } from "@/components/ProjectStakeholders/ProjectStakeholders";
import { TimelineTable } from "@/components/ProjectTimelineTable/ProjectTimelineTable";
import {
	type Update,
	Updates,
} from "@/components/ProjectUpdates/ProjectUpdates";
import {
	IndevCommentator,
	IndevConsultee,
	IndevLegacyStakeholder,
	IndevProjectRelatedLink,
	IndevTopic,
	ProjectStatus,
	type IndevEmailEnquiry,
	type IndevProcessHomepage,
	type IndevProjectTeam,
	type IndevSchedule,
	type IndevTimeline,
} from "@/feeds/inDev/types";
import { getProductDetail } from "@/feeds/publications/publications";
import { ProductGroup } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import { getProductPath } from "@/utils/url";

export type InDevelopmentPageProps = {
	consultationLink: string | null;
	description: string | null;
	developedAs: string;
	evidenceAssessmentGroup: string | null;
	fullUpdates: Update[];
	partialUpdates: Update[];
	idNumber: string | null;
	indevCommentators?: IndevCommentator[];
	indevConsultees?: IndevConsultee[];
	indevEmailEnquiries?: IndevEmailEnquiry[];
	indevLegacyStakeholders?: IndevLegacyStakeholder[];
	indevProcessHomepage?: IndevProcessHomepage;
	indevProjectTeamMembers?: IndevProjectTeam[];
	indevProjectRelatedLinks?: IndevProjectRelatedLink[];
	indevRegisterAnInterestLink: string | null;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	indevTimelineItems?: IndevTimeline[];
	indevTopicItems?: IndevTopic[];
	process: string;
	projectType: string | null;
	reference: string;
	referralDate: string | null;
	suspendDiscontinuedReason: string | null;
	suspendDiscontinuedUrl: string | null;
	suspendDiscontinuedUrlText: string | null;
	status: string;
	summary: string | null;
	technologyType: string | null;
	title: string;
	topicSelectionDecision: string;
	topicSelectionReason: string | null;
	topicSelectionFurtherInfo?: string | null;
};

export default function InDevelopmentPage({
	consultationLink,
	description,
	evidenceAssessmentGroup,
	fullUpdates,
	idNumber,
	indevCommentators,
	indevConsultees,
	indevEmailEnquiries,
	indevLegacyStakeholders,
	indevProcessHomepage,
	indevProjectTeamMembers,
	indevProjectRelatedLinks,
	indevRegisterAnInterestLink,
	indevScheduleItems,
	indevStakeholderRegistration,
	indevTimelineItems,
	indevTopicItems,
	partialUpdates,
	process,
	projectType,
	reference,
	referralDate,
	suspendDiscontinuedReason,
	suspendDiscontinuedUrl,
	suspendDiscontinuedUrlText,
	status,
	summary,
	technologyType,
	title,
	topicSelectionDecision,
	topicSelectionReason,
	topicSelectionFurtherInfo,
}: InDevelopmentPageProps): JSX.Element {
	const project = {
		indevRegisterAnInterestLink,
		indevScheduleItems,
		indevStakeholderRegistration,
		projectType,
		reference,
		referralDate,
		status,
		title,
		consultationLink,
		description,
		idNumber,
		process,
		summary,
		suspendDiscontinuedReason,
		suspendDiscontinuedUrl,
		suspendDiscontinuedUrlText,
		technologyType,
		topicSelectionDecision,
		topicSelectionReason,
		topicSelectionFurtherInfo,
	};

	return (
		<>
			<NextSeo
				title={
					"Project information | " +
					title +
					" | Indicators | Standards and Indicators"
				}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators/indevelopment">
					In development
				</Breadcrumb>
				<Breadcrumb>{reference}</Breadcrumb>
			</Breadcrumbs>
			<ProjectPageHeading project={project} />

			<ProjectInformation project={project} />

			{indevTopicItems && indevTopicItems.length > 0 ? (
				<>
					<p>Topic area:</p>
					<ul aria-label="Topic areas">
						{indevTopicItems.map((topicItem, index) => (
							<li key={`${topicItem.item}_${index}`}>{topicItem.item}</li>
						))}
					</ul>
				</>
			) : null}
			<Updates fullUpdates={fullUpdates} partialUpdates={partialUpdates} />
			{indevScheduleItems && indevScheduleItems.length > 0 ? (
				<>
					<h3>Provisional Schedule</h3>
					<dl aria-label="Provisional schedule">
						{indevScheduleItems?.map((item, index) => {
							return (
								<div key={`provisionalschedulelist_${index}`}>
									<dt key={`sched_dt_${index}`}>{item.column1}</dt>
									<dd
										key={`sched_dd_${index}`}
										dangerouslySetInnerHTML={{ __html: item.column2 }}
									/>
								</div>
							);
						})}
					</dl>
				</>
			) : null}
			{indevProjectTeamMembers && indevProjectTeamMembers?.length > 0 ? (
				<>
					<h3>Project Team</h3>
					<dl aria-label="Project team">
						{indevProjectTeamMembers?.map((member, index) => {
							return (
								<div key={`teamlist_${index}`}>
									<dt key={`member_dt_${index}`}>{member.column1}</dt>
									<dd key={`member_dd_${index}`}>{member.column2}</dd>
								</div>
							);
						})}
					</dl>
				</>
			) : null}
			{/* TODO check formatting and location of related links TURN into link */}
			{indevProjectRelatedLinks && indevProjectRelatedLinks?.length > 0 ? (
				<>
					<h3>Related Links</h3>
					<dl aria-label="Related links">
						{indevProjectRelatedLinks?.map((link, index) => {
							return (
								<div key={`relatedlinkslist_${index}`}>
									<dt key={`link_dt_${index}`}>{link.column1}</dt>
									<dd key={`link_dd_${index}`}>{link.column2}</dd>
								</div>
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
			{evidenceAssessmentGroup && (
				<dl>
					<dd>External Assessment Group</dd>
					<dt>{evidenceAssessmentGroup}</dt>
				</dl>
			)}
			<Stakeholders
				legacyStakeholders={indevLegacyStakeholders}
				consultees={indevConsultees}
				commentators={indevCommentators}
			/>
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
		description,
		developedAs,
		evidenceAssessmentGroup,
		idNumber,
		process,
		projectType,
		reference,
		referralDate,
		suspendDiscontinuedReason,
		suspendDiscontinuedUrl,
		suspendDiscontinuedUrlText,
		summary,
		status,
		technologyType,
		title,
		topicSelectionDecision,
		topicSelectionFurtherInfo,
		topicSelectionReason,
	} = project;

	const consultationPanels = arrayify(
			project.embedded.niceIndevPanelList?.embedded?.niceIndevPanel
		).filter(
			(panel) =>
				panel.showPanel &&
				panel.embedded.niceIndevConsultation &&
				panel.panelType == "History"
		),
		consultation = consultationPanels
			.flatMap((panel) => arrayify(panel.embedded.niceIndevConsultation))
			.find((consultation) => consultation.reference === project.reference),
		consultationLink = consultation ? consultation.links.self[0].href : null,
		indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		),
		indevFullUpdate =
			project.embedded.niceIndevFullUpdateList?.embedded.niceIndevFullUpdate,
		indevFullUpdateItems = arrayify(indevFullUpdate),
		indevPartialUpdate =
			project.embedded.niceIndevPartialUpdateList?.embedded
				.niceIndevPartialUpdate,
		indevPartialUpdateItems = arrayify(indevPartialUpdate),
		indevTopicList =
			project.embedded.niceIndevTopicList?.embedded.niceIndevTopic,
		indevTopicItems = arrayify(indevTopicList),
		indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevTimeline =
			project.embedded.niceIndevTimelineList?.embedded.niceIndevTimeline,
		indevTimelineItems = arrayify(indevTimeline),
		indevProjectTeam =
			project.embedded.niceIndevProjectTeamList?.embedded.niceIndevProjectTeam,
		indevProjectTeamMembers = arrayify(indevProjectTeam),
		indevProjectRelatedLinkList =
			project.embedded.niceIndevProjectRelatedLinkList?.embedded
				.niceIndevProjectRelatedLink,
		indevProjectRelatedLinks = arrayify(indevProjectRelatedLinkList),
		indevLegacyStakeholdersList =
			project.embedded.niceIndevLegacyStakeholderList?.embedded
				.niceIndevLegacyStakeholder,
		indevLegacyStakeholders = arrayify(indevLegacyStakeholdersList),
		indevConsulteeList =
			project.embedded.niceIndevConsulteeList?.embedded.niceIndevConsultee,
		indevConsultees = arrayify(indevConsulteeList),
		indevCommentatorList =
			project.embedded.niceIndevCommentatorList?.embedded.niceIndevCommentator,
		indevCommentators = arrayify(indevCommentatorList),
		indevEmailEnquiry =
			project.embedded.niceIndevEmailEnquiryList?.embedded
				.niceIndevEmailEnquiry,
		indevEmailEnquiries = arrayify(indevEmailEnquiry),
		projectStatusDisplayName = (status: ProjectStatus) => {
			if (status == ProjectStatus.AwaitingDevelopment)
				return "Awaiting development";
			if (status == ProjectStatus.InProgress) return "In progress";
			if (status == ProjectStatus.TopicSelection) return "Topic selection";
			if (status == ProjectStatus.ImpactedByCOVID19)
				return "Impacted by COVID-19";
			else return status;
		};

	let indevProcessHomepage = null;

	if (project.embedded.niceIndevProcessHomepage) {
		indevProcessHomepage = project.embedded.niceIndevProcessHomepage;
	}

	function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
		return value !== null && value !== undefined;
	}
	const getPartiallyUpdatedProducts = indevPartialUpdateItems
			.map((item) => item.updateReference)
			.map(getProductDetail),
		partiallyUpdatedProducts = await Promise.all(getPartiallyUpdatedProducts),
		getFullyUpdatedProducts = indevFullUpdateItems
			.map((item) => item.updateReference)
			.map(getProductDetail),
		fullyUpdatedProducts = await Promise.all(getFullyUpdatedProducts),
		fullUpdates = fullyUpdatedProducts.filter(notEmpty).map((product) => {
			return {
				title: product.title,
				id: product.id,
				productPath: getProductPath({
					...product,
					productGroup: ProductGroup.Guidance,
				}),
			};
		}),
		partialUpdates = partiallyUpdatedProducts
			.filter(notEmpty)
			.map((product) => {
				return {
					title: product.title,
					id: product.id,
					productPath: getProductPath({
						...product,
						productGroup: ProductGroup.Guidance,
					}),
				};
			});

	let indevRegisterAnInterestLink = null;

	// TODO move into render phase
	if (projectType == "IPG" || status != ProjectStatus.Discontinued) {
		indevRegisterAnInterestLink = `/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${reference}&returnUrl=/guidance/indevelopment/${reference}`;
	}
	return {
		props: {
			consultationLink,
			description,
			developedAs,
			evidenceAssessmentGroup,
			partialUpdates,
			fullUpdates,
			idNumber,
			indevCommentators,
			indevConsultees,
			indevEmailEnquiries,
			indevLegacyStakeholders,
			indevProcessHomepage,
			indevProjectTeamMembers,
			indevProjectRelatedLinks,
			indevRegisterAnInterestLink,
			indevScheduleItems,
			indevStakeholderRegistration,
			indevTimelineItems,
			indevTopicItems,
			process,
			projectType,
			reference,
			referralDate,
			suspendDiscontinuedReason,
			suspendDiscontinuedUrl,
			suspendDiscontinuedUrlText,
			status: projectStatusDisplayName(status),
			summary,
			technologyType,
			title,
			topicSelectionDecision,
			topicSelectionFurtherInfo,
			topicSelectionReason,
		},
	};
};
