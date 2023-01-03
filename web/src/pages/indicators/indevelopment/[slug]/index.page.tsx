import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
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
	TopicSelectionReason,
	type IndevEmailEnquiry,
	type IndevProcessHomepage,
	type IndevProjectTeam,
	type IndevSchedule,
	type IndevTimeline,
} from "@/feeds/inDev/types";
import { getProductDetail } from "@/feeds/publications/publications";
import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { validateRouteParams } from "@/utils/project";
import { getProductPath } from "@/utils/url";

export type InDevelopmentPageProps = {
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
	topicSelectionFurtherInfo?: string | null;
	topicSelectionReasonText?: string | null;
};

export default function InDevelopmentPage({
	description,
	// developedAs,
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
	topicSelectionFurtherInfo,
	topicSelectionReasonText,
}: InDevelopmentPageProps): JSX.Element {
	const project = {
		indevRegisterAnInterestLink,
		indevScheduleItems,
		indevStakeholderRegistration,
		projectType,
		reference,
		status,
		title,
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

			{projectType?.toLowerCase().startsWith("ipg") ? (
				<Link to="/about/what-we-do/our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance/IP-register-an-interest">
					<a>Register an interest in this interventional procedure</a>
				</Link>
			) : null}

			{summary && <p>{summary}</p>}
			{suspendDiscontinuedReason && (
				<p data-testid="suspendDiscontinuedReason">
					{suspendDiscontinuedReason}
				</p>
			)}
			{suspendDiscontinuedUrl && suspendDiscontinuedUrlText && (
				<Link to={suspendDiscontinuedUrl}>
					<a>{suspendDiscontinuedUrlText}</a>
				</Link>
			)}
			{/* TODO Read the consultation documents - link to https://www.nice.org.uk/guidance/indevelopment/gid-dg10049/consultation/html-content
			individual documents :-
			Diagnostics consultation document (Online commenting) - https://www.nice.org.uk/consultations/1567/1/dap63-dcd-automated-abpi-for-consultation-webdocx
			Diagnostics consultation document (PDF) - https://www.nice.org.uk/guidance/GID-DG10049/documents/514
			Committee papers – Diagnostics assessment report, Overview, DAR Comments table and EAG response, DAR Addendum, DAR Erratum -https://www.nice.org.uk/guidance/GID-DG10049/documents/diagnostics-assessment-report
			  foreach (var consultation in Model.ConsultationUrls)
        {
            consultationIndex++;
            <div>
                @if (Model.ConsultationUrls.Count > 1)
                {
                    <a class="btn btn-primary" href="@consultation">Read consultation @consultationIndex documents</a>
                    if (consultationIndex < Model.ConsultationUrls.Count)
                    {
                        <br /><br />
                    }
                }
                else
                {
                    <a class="btn btn-primary" href="@consultation">Read the consultation documents</a>
                }
            </div>
        } */}
			<button>Read the consultation documents</button>
			{status && <p>Status: {status}</p>}
			{technologyType && <p>Technology type: {technologyType}</p>}
			{topicSelectionDecision && <p>Decision: {topicSelectionDecision} </p>}
			{topicSelectionReasonText && (
				<p data-testid="reason">
					Reason for decision: {topicSelectionReasonText}{" "}
				</p>
			)}
			{topicSelectionFurtherInfo && (
				<p>Further information: {topicSelectionFurtherInfo} </p>
			)}
			{process && status !== ProjectStatus.TopicSelection ? (
				projectType == ProductTypeAcronym.NG ? (
					<p>Developed as: {process}</p>
				) : (
					<p>Process: {process}</p>
				)
			) : null}
			{/* TODO remove 'Process' and 'Developed as' if the logic above covers it */}
			{/* <p>Process: {process}</p> */}
			{/* <p>Developed as: {developedAs}</p> */}

			{description && <p>Description: {description}</p>}
			{idNumber && <p>ID number: {idNumber}</p>}
			{/* TODO check formatting of referral date */}
			{process == "MT" && referralDate ? (
				<p>Notification date: {referralDate}</p>
			) : (
				referralDate && (
					<p>
						Referral date:
						<time dateTime={stripTime(referralDate)}>
							&nbsp;{formatDateStr(referralDate)}
						</time>
					</p>
				)
			)}

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
								<>
									<dt key={`sched_dt_${index}`}>{item.column1}</dt>
									<dd key={`sched_dd_${index}`}>{item.column2}</dd>
								</>
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
								<>
									<dt key={`member_dt_${index}`}>{member.column1}</dt>
									<dd key={`member_dd_${index}`}>{member.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{/* TODO check formatting and location of related links */}
			{indevProjectRelatedLinks && indevProjectRelatedLinks?.length > 0 ? (
				<>
					<h3>Related Links</h3>
					<dl aria-label="Related links">
						{indevProjectRelatedLinks?.map((link, index) => {
							return (
								<>
									<dt key={`link_dt_${index}`}>{link.column1}</dt>
									<dd key={`link_dd_${index}`}>{link.column2}</dd>
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
		productTypeName,
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

	const indevStakeholderRegistration = arrayify(
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
			if (status == "AwaitingDevelopment") return "Awaiting development";
			if (status == "InProgress") return "In progress";
			if (status == "TopicSelection") return "Topic selection";
			if (status == "ImpactedByCOVID19") return "Impacted by COVID-19";
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

	let topicSelectionReasonText;

	switch (topicSelectionReason) {
		case "Monitor":
			topicSelectionReasonText = TopicSelectionReason.Monitor;
			break;
		case "Anticipate":
			topicSelectionReasonText = TopicSelectionReason.Anticipate;
			break;
		case "NotEligible":
			topicSelectionReasonText = TopicSelectionReason.NotEligible;
			break;
		case "FurtherDiscussion":
			topicSelectionReasonText = TopicSelectionReason.FurtherDiscussion;
			break;
		default:
			topicSelectionReasonText = null;
			break;
	}

	let indevRegisterAnInterestLink = null;

	// TODO: if projectIsNull OR project.productType NOT "IPG" OR project.Status == isDiscontinued() THEN show the register an interest link with querystring ?t=0&p=[project.Reference]&returnUrl[returnUrl]
	// Example from guidance-web "https://alpha.nice.org.uk/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=GID-IPG10305&returnUrl=/guidance/indevelopment/gid-ipg10305"
	//TODO: is there a better way of constructing the returnUrl param?
	if (!project || project.status?.toLowerCase() == "discontinued") {
		indevRegisterAnInterestLink = `/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${project.reference}&returnUrl=/indicators/indevelopment/${project.reference}`;
	} else {
		console.log("don't display 'Register an interest' link");
	}
	return {
		props: {
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
			status: projectStatusDisplayName(status as ProjectStatus),
			summary,
			technologyType,
			title,
			topicSelectionDecision,
			topicSelectionFurtherInfo,
			topicSelectionReasonText,
		},
	};
};
