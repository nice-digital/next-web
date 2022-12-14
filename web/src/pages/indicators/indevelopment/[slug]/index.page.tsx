import { type GetServerSideProps } from "next/types";

import { Link } from "@/components/Link/Link";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { TimelineTable } from "@/components/ProjectTimelineTable/ProjectTimelineTable";
import {
	IndevCommentator,
	IndevConsultee,
	IndevTopic,
	ProjectStatus,
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

export type Update = { title: string; id: string; productPath: string };

export type InDevelopmentPageProps = {
	fullUpdates: Update[];
	partialUpdates: Update[];
	indevTopicItems?: IndevTopic[];
	indevScheduleItems?: IndevSchedule[];
	indevTimelineItems?: IndevTimeline[];
	indevProjectTeamMembers?: IndevProjectTeam[];
	indevConsultees?: IndevConsultee[];
	indevCommentators?: IndevCommentator[];
	indevEmailEnquiries?: IndevEmailEnquiry[];
	indevProcessHomepage?: IndevProcessHomepage;
	title: string;
	summary: string | null;
	referralDate: string | null;
	status: string;
	technologyType: string | null;
	projectType: string | null;
	topicSelectionDecision: string;
	process: string;
	developedAs: string;
	idNumber: string | null;
	evidenceAssessmentGroup: string | null;
	reference: string;
	indevStakeholderRegistration: Record<string, unknown>[];
	topicSelectionFurtherInfo?: string;
};

export default function InDevelopmentPage({
	fullUpdates,
	partialUpdates,
	indevTopicItems,
	indevScheduleItems,
	indevTimelineItems,
	indevProjectTeamMembers,
	indevConsultees,
	indevCommentators,
	indevEmailEnquiries,
	indevProcessHomepage,
	title,
	summary,
	referralDate,
	status,
	technologyType,
	projectType,
	topicSelectionDecision,
	process,
	developedAs,
	idNumber,
	evidenceAssessmentGroup,
	reference,
	indevStakeholderRegistration,
	topicSelectionFurtherInfo,
}: InDevelopmentPageProps): JSX.Element {
	const project = {
		reference,
		title,
		status,
		indevScheduleItems,
		indevStakeholderRegistration,
	};

	return (
		<>
			<ProjectPageHeading project={project} />
			{summary && <p>{summary}</p>}
			{status && <p>Status: {status}</p>}
			{technologyType && <p>Technology type: {technologyType}</p>}
			{topicSelectionDecision && <p>Decision: {topicSelectionDecision} </p>}
			<p>Reason for decision: TODO</p>
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
			{/* TODO check formatting of referral date */}
			{referralDate && <p>Referral date: {referralDate}</p>}
			{indevTopicItems && indevTopicItems.length > 0 ? (
				<p>Topic area: {indevTopicItems[0].item}</p>
			) : null}

			{idNumber && <p>ID number: {idNumber}</p>}

			{fullUpdates && fullUpdates.length > 0 ? (
				<>
					<p>This guidance will fully update the following:</p>
					<ul>
						{fullUpdates?.map((product, index) => {
							return (
								<li key={`${product.title}_${index}`}>
									<Link to={product.productPath}>
										<a>
											{product.title} ({product.id})
										</a>
									</Link>
								</li>
							);
						})}
					</ul>
				</>
			) : null}

			{partialUpdates && partialUpdates.length > 0 ? (
				<>
					<p>This guidance will partially update the following:</p>
					<ul>
						{partialUpdates?.map((product, index) => {
							return (
								<li key={`${product.title}_${index}`}>
									<Link to={product.productPath}>
										<a>
											{product.title} ({product.id})
										</a>
									</Link>
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

			{/* TODO stakeholders list */}
			{indevConsultees && indevConsultees?.length > 0 ? (
				<>
					<h3>Stakeholders</h3>
					<dl>
						{indevConsultees?.map((consultee) => {
							return (
								<>
									<dt>{consultee.column1}</dt>
									<dd>{consultee.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{indevCommentators && indevCommentators.length > 0 ? (
				<dl>
					{indevCommentators?.map((commentator) => {
						return (
							<>
								<dt>{commentator.column1}</dt>
								<dd>{commentator.column2}</dd>
							</>
						);
					})}
				</dl>
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
		referralDate,
		status,
		technologyType,
		projectType,
		topicSelectionDecision,
		process,
		developedAs,
		idNumber,
		evidenceAssessmentGroup,
		reference,
		topicSelectionFurtherInfo,
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

	return {
		props: {
			partialUpdates,
			fullUpdates,
			indevTopicItems,
			indevScheduleItems,
			indevTimelineItems,
			indevProjectTeamMembers,
			indevConsultees,
			indevCommentators,
			indevEmailEnquiries,
			indevProcessHomepage,
			title,
			summary,
			referralDate,
			status,
			technologyType,
			projectType,
			topicSelectionDecision,
			process,
			developedAs,
			idNumber,
			evidenceAssessmentGroup,
			reference,
			indevStakeholderRegistration,
			topicSelectionFurtherInfo,
		},
	};
};
