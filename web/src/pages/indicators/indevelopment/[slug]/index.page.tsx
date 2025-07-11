import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { DefinitionList } from "@/components/DefinitionList/DefinitionList";
import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectInformation } from "@/components/ProjectInformation/ProjectInformation";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { Stakeholders } from "@/components/ProjectStakeholders/ProjectStakeholders";
import { Timeline } from "@/components/ProjectTimelineTable/ProjectTimelineTable";
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
import { arrayify, isTruthy } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import { getProductPath } from "@/utils/url";

import styles from "./index.module.scss";

export type InDevelopmentPageProps = {
	alert: string | null;
	hasPanels: boolean;
	consultationUrls: string[];
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
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	indevTimelineItems?: IndevTimeline[];
	indevTopicItems?: IndevTopic[];
	isGuidanceHubPage: boolean;
	process: string;
	projectPath: string;
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
	content: string | null;
	topicSelectionReason: string | null;
	topicSelectionFurtherInfo: string | null;
};

export default function InDevelopmentPage(
	props: InDevelopmentPageProps
): JSX.Element {
	const {
		alert,
		evidenceAssessmentGroup,
		fullUpdates,
		indevCommentators,
		indevConsultees,
		indevEmailEnquiries,
		indevLegacyStakeholders,
		indevProcessHomepage,
		indevProjectTeamMembers,
		indevProjectRelatedLinks,
		indevScheduleItems,
		indevTimelineItems,
		indevTopicItems,
		partialUpdates,
		projectPath,
		reference,
		title,
		isGuidanceHubPage,
	} = props;

	// If it's a hub page, the middle breadcrumbs need swapping out
	const MiddleBreadcrumbs = () =>
		isGuidanceHubPage ? (
			<>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb to="/guidance/indevelopment">In development</Breadcrumb>
			</>
		) : (
			<>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to="/indicators/indevelopment" elementType={Link}>
					In development
				</Breadcrumb>
			</>
		);

	const pageTitle = isGuidanceHubPage
		? `${title} | Hub`
		: `${title} | Indicators`;

	return (
		<div className={styles.projectInformation}>
			<NextSeo title={pageTitle} />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<MiddleBreadcrumbs />
				<Breadcrumb>{reference}</Breadcrumb>
			</Breadcrumbs>

			<ProjectPageHeading {...props} />

			{alert && (
				<div
					className="alert-message"
					dangerouslySetInnerHTML={{ __html: alert }}
				/>
			)}

			<ProjectHorizontalNav
				projectPath={projectPath}
				hasDocuments={props.hasPanels}
				consultationUrls={props.consultationUrls}
			/>

			<ProjectInformation {...props} />

			{!isGuidanceHubPage && (
				<>
					{indevTopicItems && indevTopicItems.length > 0 ? (
						<>
							<p>Topic area:</p>
							<ul aria-label="Topic areas" className="list list--unstyled">
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
							<DefinitionList ariaLabel="Provisional schedule">
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
							</DefinitionList>
						</>
					) : null}
					{indevProjectTeamMembers && indevProjectTeamMembers?.length > 0 ? (
						<>
							<h3>Project Team</h3>
							<DefinitionList ariaLabel="Project team">
								{indevProjectTeamMembers?.map((member, index) => {
									return (
										<div key={`teamlist_${index}`}>
											<dt key={`member_dt_${index}`}>{member.column1}</dt>
											<dd key={`member_dd_${index}`}>{member.column2}</dd>
										</div>
									);
								})}
							</DefinitionList>
						</>
					) : null}

					{indevProjectRelatedLinks && indevProjectRelatedLinks?.length > 0 ? (
						<>
							<h3>Related Links</h3>
							<ul aria-label="Related links">
								{indevProjectRelatedLinks?.map((link, index) => {
									return (
										<li key={`link_dd_${index}`}>
											<Link to={link.column2}>{link.column1}</Link>
										</li>
									);
								})}
							</ul>
						</>
					) : null}
					{indevEmailEnquiries && indevEmailEnquiries.length > 0 ? (
						<>
							<h3>Email enquiries</h3>
							<span>If you have any queries please email</span>
							<ul className="list list--unstyled">
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
						<DefinitionList ariaLabel="External assessment group">
							<dd>External Assessment Group</dd>
							<dt>{evidenceAssessmentGroup}</dt>
						</DefinitionList>
					)}
					<Stakeholders
						legacyStakeholders={indevLegacyStakeholders}
						consultees={indevConsultees}
						commentators={indevCommentators}
					/>
					{indevTimelineItems && indevTimelineItems.length > 0 ? (
						<Timeline data={indevTimelineItems} />
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
			)}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<
	InDevelopmentPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, consultationUrls, hasPanels } = result;

	const {
		alert,
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
		content,
		topicSelectionFurtherInfo,
		topicSelectionReason,
	} = project;

	const indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		),
		indevFullUpdate =
			project.embedded?.niceIndevFullUpdateList?.embedded.niceIndevFullUpdate,
		indevFullUpdateItems = arrayify(indevFullUpdate),
		indevPartialUpdate =
			project.embedded?.niceIndevPartialUpdateList?.embedded
				.niceIndevPartialUpdate,
		indevPartialUpdateItems = arrayify(indevPartialUpdate),
		indevTopicList =
			project.embedded?.niceIndevTopicList?.embedded.niceIndevTopic,
		indevTopicItems = arrayify(indevTopicList),
		indevSchedule =
			project.embedded?.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevTimeline =
			project.embedded?.niceIndevTimelineList?.embedded.niceIndevTimeline,
		indevTimelineItems = arrayify(indevTimeline),
		indevProjectTeam =
			project.embedded?.niceIndevProjectTeamList?.embedded.niceIndevProjectTeam,
		indevProjectTeamMembers = arrayify(indevProjectTeam),
		indevProjectRelatedLinkList =
			project.embedded?.niceIndevProjectRelatedLinkList?.embedded
				.niceIndevProjectRelatedLink,
		indevProjectRelatedLinks = arrayify(indevProjectRelatedLinkList),
		indevLegacyStakeholdersList =
			project.embedded?.niceIndevLegacyStakeholderList?.embedded
				.niceIndevLegacyStakeholder,
		indevLegacyStakeholders = arrayify(indevLegacyStakeholdersList),
		indevConsulteeList =
			project.embedded?.niceIndevConsulteeList?.embedded.niceIndevConsultee,
		indevConsultees = arrayify(indevConsulteeList),
		indevCommentatorList =
			project.embedded?.niceIndevCommentatorList?.embedded.niceIndevCommentator,
		indevCommentators = arrayify(indevCommentatorList),
		indevEmailEnquiry =
			project.embedded?.niceIndevEmailEnquiryList?.embedded
				.niceIndevEmailEnquiry,
		indevEmailEnquiries = arrayify(indevEmailEnquiry),
		projectStatusDisplayName = (status: ProjectStatus) => {
			if (status == ProjectStatus.Proposed) return "Awaiting development";
			if (status == ProjectStatus.InProgress) return "In progress";
			if (status == ProjectStatus.TopicSelection) return "Topic selection";
			if (status == ProjectStatus.ImpactedByCOVID19)
				return "Impacted by COVID-19";
			else return status;
		};

	const isGuidanceHubPage = projectType?.toString() === "HUB";

	let indevProcessHomepage = null;

	if (project.embedded?.niceIndevProcessHomepage) {
		indevProcessHomepage = project.embedded.niceIndevProcessHomepage;
	}

	const getPartiallyUpdatedProducts = indevPartialUpdateItems
			.map((item) => item.updateReference)
			.map(getProductDetail),
		partiallyUpdatedProducts = await Promise.all(getPartiallyUpdatedProducts),
		getFullyUpdatedProducts = indevFullUpdateItems
			.map((item) => item.updateReference)
			.map(getProductDetail),
		fullyUpdatedProducts = await Promise.all(getFullyUpdatedProducts),
		fullUpdates = fullyUpdatedProducts.filter(isTruthy).map((product) => {
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
			.filter(isTruthy)
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
			alert,
			hasPanels,
			consultationUrls,
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
			indevScheduleItems,
			indevStakeholderRegistration,
			indevTimelineItems,
			indevTopicItems,
			isGuidanceHubPage,
			process,
			projectPath,
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
			content,
			topicSelectionFurtherInfo,
			topicSelectionReason,
		},
	};
};
