import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

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
	} = props;

	return (
		<div className={styles.projectInformation}>
			<NextSeo title={`${title} | HUB `} />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb>Hub</Breadcrumb>
				<Breadcrumb to="/hub/indevelopment" elementType={Link}>
					In development
				</Breadcrumb>
				<Breadcrumb>{reference}</Breadcrumb>
			</Breadcrumbs>

			<ProjectPageHeading {...props} />

			<ProjectHorizontalNav
				projectPath={projectPath}
				hasDocuments={props.hasPanels}
				consultationUrls={props.consultationUrls}
			/>

			<ProjectInformation {...props} />

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
			if (status == ProjectStatus.Proposed) return "Awaiting development";
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
