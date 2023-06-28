import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { validateRouteParams } from "@/utils/project";

export type ConsultationHTMLPageProps = {
	alert: string | null;
	consultationUrls: string[];
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status" | "lastModifiedDate"
	>;
	projectPath: string;
	consultation: {
		html: string;
		title: string;
	};
	shouldUseNewConsultationComments: boolean;
};

export default function ConsultationHTMLPage({
	alert,
	consultation,
	consultationUrls,
	indevStakeholderRegistration,
	project,
	projectPath,
	indevScheduleItems,
	shouldUseNewConsultationComments,
}: ConsultationHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${consultation.title} | ${project.reference} | Indicators | Standards and Indicators`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to="/indicators/indevelopment" elementType={Link}>
					In development
				</Breadcrumb>
				<Breadcrumb
					to={`/indicators/indevelopment/${project.reference.toLowerCase()}`}
					elementType={Link}
				>
					{project.reference}
				</Breadcrumb>
				<Breadcrumb>{consultation.title}</Breadcrumb>
			</Breadcrumbs>
			<ProjectPageHeading
				projectPath={projectPath}
				projectType={project.projectType}
				reference={project.reference}
				title={project.title}
				status={project.status}
				indevScheduleItems={indevScheduleItems}
				indevStakeholderRegistration={indevStakeholderRegistration}
				shouldUseNewConsultationComments={shouldUseNewConsultationComments}
			/>
			{alert && (
				<div
					className="alert-message"
					dangerouslySetInnerHTML={{ __html: alert }}
				/>
			)}
			<ProjectHorizontalNav
				projectPath={projectPath}
				hasDocuments
				consultationUrls={consultationUrls}
			/>
			<h2>{consultation.title}</h2>
			<div dangerouslySetInnerHTML={{ __html: consultation.html }}></div>
			{project.lastModifiedDate ? (
				<p>
					This page was last updated on{" "}
					<time dateTime={stripTime(project.lastModifiedDate)}>
						{formatDateStr(project.lastModifiedDate)}
					</time>
				</p>
			) : null}
		</>
	);
}

export type Params = {
	slug: string;
	resourceTitleId: string;
};

export const getServerSideProps: GetServerSideProps<
	ConsultationHTMLPageProps,
	Params
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, consultationPanels, consultationUrls } = result;

	const consultationPanel = consultationPanels.find(
		(panel) =>
			panel.embedded.niceIndevConsultation.resourceTitleId ===
			params?.resourceTitleId
	);

	if (!consultationPanel) return { notFound: true };

	const consultationFilePath =
			consultationPanel.embedded.niceIndevConsultation.links.self[0].href,
		consultationHTML = await getResourceFileHTML(consultationFilePath);

	if (consultationHTML == null) {
		logger.warn(`Consultation HTML not found at ${consultationFilePath}`);
		return { notFound: true };
	}

	const { alert, projectType, reference, status, title } = project,
		indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		),
		lastModifiedDate = project.lastModifiedDate;

	const consultationResources = arrayify(
		consultationPanel.embedded.niceIndevResourceList.embedded.niceIndevResource
	);

	const shouldUseNewConsultationComments = consultationResources.some(
		(resource) =>
			resource.convertedDocument ||
			resource.supportsComments ||
			!!resource.supportsQuestions
	);

	return {
		props: {
			alert,
			consultationUrls,
			indevScheduleItems,
			indevStakeholderRegistration,
			project: {
				projectType,
				reference,
				status,
				title,
				lastModifiedDate,
			},
			projectPath,
			consultation: {
				html: consultationHTML,
				title:
					consultationPanel.embedded.niceIndevConsultation.consultationName,
			},
			shouldUseNewConsultationComments,
		},
	};
};
