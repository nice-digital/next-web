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
import { validateRouteParams } from "@/utils/project";
import { getProductPath } from "@/utils/url";

export type InDevelopmentPageProps = {
	developedAs: string;
	evidenceAssessmentGroup: string | null;
	fullUpdates: Update[];
	partialUpdates: Update[];
	idNumber: string | null;
	indevCommentators?: IndevCommentator[];
	indevConsultees?: IndevConsultee[];
	indevEmailEnquiries?: IndevEmailEnquiry[];
	indevProcessHomepage?: IndevProcessHomepage;
	indevProjectTeamMembers?: IndevProjectTeam[];
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
	developedAs,
	evidenceAssessmentGroup,
	fullUpdates,
	idNumber,
	indevCommentators,
	indevConsultees,
	indevEmailEnquiries,
	indevProcessHomepage,
	indevProjectTeamMembers,
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
		indevScheduleItems,
		indevStakeholderRegistration,
		reference,
		status,
		title,
	};

	return (
		<>
			{/* TODO Add title e.g. Project information | Macitentan for treating pulmonary arterial hypertension in people 1 month to 17 years TS ID 11805 | Guidance | NICE */}
			{/* TODO Add additional meta data - indevelopment, gid, expected publication date */}
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
			{/* TODO Register an interest in this interventional procedure, Please see: https://www.nice.org.uk/guidance/indevelopment/gid-ipg10149
			e.g. https://www.nice.org.uk/guidance/indevelopment/gid-ip1046 */}
			{summary && <p>{summary}</p>}
			{status && <p>Status: {status}</p>}
			{technologyType && <p>Technology type: {technologyType}</p>}
			{topicSelectionDecision && <p>Decision: {topicSelectionDecision} </p>}
			{topicSelectionReasonText && (
				<p>Reason for decision: {topicSelectionReasonText} </p>
			)}
			{topicSelectionFurtherInfo && (
				<p>Further information: {topicSelectionFurtherInfo} </p>
			)}
			{/* TODO Check this logic from guidance web is still ok to use */}
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

			{/* {referralDate && <p>Referral date: {referralDate}</p>} */}

			{indevTopicItems && indevTopicItems.length > 0 ? (
				<>
					<p>Topic area:</p>
					<ul>
						{indevTopicItems.map((topicItem, index) => (
							<li key={`${topicItem.item}_${index}`}>{topicItem.item}</li>
						))}
					</ul>
				</>
			) : null}

			{idNumber && <p>ID number: {idNumber}</p>}
			{/* TODO check formatting of referral date */}
			{process == "MT" && referralDate ? (
				<p>Notification date: {referralDate}</p>
			) : (
				referralDate && <p>Referral date: {referralDate}</p>
			)}

			<Updates fullUpdates={fullUpdates} partialUpdates={partialUpdates} />

			{suspendDiscontinuedReason && <p>suspendDiscontinuedReason</p>}
			{suspendDiscontinuedUrl && suspendDiscontinuedUrlText && (
				<Link to={suspendDiscontinuedUrl}>
					<a>{suspendDiscontinuedUrlText}</a>
				</Link>
			)}

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

			{evidenceAssessmentGroup && (
				<dl>
					<dd>External Assessment Group</dd>
					<dt>{evidenceAssessmentGroup}</dt>
				</dl>
			)}

			<Stakeholders
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
		indevConsulteeList =
			project.embedded.niceIndevConsulteeList?.embedded.niceIndevConsultee,
		indevConsultees = arrayify(indevConsulteeList),
		indevCommentatorList =
			project.embedded.niceIndevCommentatorList?.embedded.niceIndevCommentator,
		indevCommentators = arrayify(indevCommentatorList),
		indevEmailEnquiry =
			project.embedded.niceIndevEmailEnquiryList?.embedded
				.niceIndevEmailEnquiry,
		indevEmailEnquiries = arrayify(indevEmailEnquiry);

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

	return {
		props: {
			developedAs,
			evidenceAssessmentGroup,
			partialUpdates,
			fullUpdates,
			idNumber,
			indevCommentators,
			indevConsultees,
			indevEmailEnquiries,
			indevProcessHomepage,
			indevProjectTeamMembers,
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
			status,
			summary,
			technologyType,
			title,
			topicSelectionDecision,
			topicSelectionFurtherInfo,
			topicSelectionReasonText,
		},
	};
};
