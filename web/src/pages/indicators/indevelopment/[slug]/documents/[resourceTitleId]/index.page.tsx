import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/project";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

export type DocumentHTMLPageProps = {
	consultationUrls: string[];
	projectPath: string;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	> & {
		groups: ResourceGroupViewModel[];
	};
	resource: {
		resourceFileHTML: string;
		title: string;
	};
};

export default function HistoryHTMLPage({
	consultationUrls,
	project,
	indevStakeholderRegistration,
	projectPath,
	resource,
	indevScheduleItems,
}: DocumentHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${resource.title} | Project documents | ${project.reference} | Indicators | Standards and Indicators`}
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
				<Breadcrumb
					to={`/indicators/indevelopment/${project.reference.toLowerCase()}/documents/`}
					elementType={Link}
				>
					Project documents
				</Breadcrumb>
				<Breadcrumb>{resource.title}</Breadcrumb>
			</Breadcrumbs>
			<ProjectPageHeading
				projectPath={projectPath}
				projectType={project.projectType}
				reference={project.reference}
				title={project.title}
				status={project.status}
				indevScheduleItems={indevScheduleItems}
				indevStakeholderRegistration={indevStakeholderRegistration}
			/>
			<ProjectHorizontalNav
				projectPath={projectPath}
				hasDocuments
				consultationUrls={consultationUrls}
			/>

			<ResourceList title="Project documents" groups={project.groups} />
			{resource.resourceFileHTML == "" ? null : (
				<div
					dangerouslySetInnerHTML={{ __html: resource.resourceFileHTML }}
				></div>
			)}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentHTMLPageProps,
	{ slug: string; resourceTitleId: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams({ params, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, projectPath, consultationUrls } = result;

	const resource = panels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find(
			(resource) =>
				resource.embedded?.niceIndevFile.resourceTitleId ===
					params?.resourceTitleId && resource.showInDocList
			// TODO: We probably want to exclude consultations here: we don't want them to render on the /documents URL
		);

	if (!resource || !resource.embedded) return { notFound: true };

	const resourceFilePath = resource.embedded.niceIndevFile.links.self[0].href,
		resourceFileHTML = await getResourceFileHTML(resourceFilePath);

	if (resourceFileHTML == null) return { notFound: true };

	const { projectType, reference, status, title } = project;

	const indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		);

	const groups = panels
		.filter((panel) => !panel.legacyPanel && panel.title === resource.title)
		.map((panel) => {
			const indevResource =
					panel.embedded.niceIndevResourceList.embedded.niceIndevResource,
				indevResources = arrayify(indevResource).filter(
					(resource) => resource.showInDocList
				),
				subGroups: ResourceSubGroupViewModel[] = [];

			let currentSubGroup: ResourceSubGroupViewModel;

			indevResources.forEach((resource) => {
				//TODO check if this is reliable enough not to result in document linking to itself
				// if (resource.title === panel.title) return;
				if (
					resource.embedded?.niceIndevFile.resourceTitleId ===
					params?.resourceTitleId
				)
					return;

				if (resource.textOnly) {
					currentSubGroup = { title: resource.title, resourceLinks: [] };
					subGroups.push(currentSubGroup);
				} else {
					if (!currentSubGroup) {
						currentSubGroup = { title: panel.title, resourceLinks: [] };
						subGroups.push(currentSubGroup);
					}

					if (!resource.embedded) {
						if (!resource.externalUrl)
							throw Error(
								`Found resource (${resource.title}) with nothing embedded and no external URL`
							);

						currentSubGroup.resourceLinks.push({
							title: resource.title,
							href: resource.externalUrl,
							fileTypeName: null,
							fileSize: null,
							date: resource.publishedDate,
							type: panel.title,
						});
					} else {
						const { mimeType, length, resourceTitleId, fileName } =
								resource.embedded.niceIndevFile,
							shouldUseNewConsultationComments =
								resource.convertedDocument ||
								resource.supportsComments ||
								resource.supportsQuestions,
							isHTML = mimeType === "text/html",
							isConsultation =
								resource.consultationId > 0 &&
								panel.embedded.niceIndevConsultation,
							fileSize = isHTML ? null : length,
							fileTypeName = isHTML ? null : getFileTypeNameFromMime(mimeType),
							href = shouldUseNewConsultationComments
								? `/consultations/${resource.consultationId}/${resource.consultationDocumentId}`
								: !isHTML
								? `${projectPath}/downloads/${reference.toLowerCase()}-${resourceTitleId}.${
										fileName.split(".").slice(-1)[0]
								  }`
								: isConsultation
								? `${projectPath}/consultations/${resourceTitleId}`
								: `${projectPath}/documents/${resourceTitleId}`;

						currentSubGroup.resourceLinks.push({
							title: resource.title,
							href,
							fileTypeName,
							fileSize,
							date: resource.publishedDate,
							type: panel.title,
						});
					}
				}
			});

			return {
				title: panel.title,
				subGroups,
			};
		});

	return {
		props: {
			projectPath,
			consultationUrls,
			indevScheduleItems,
			indevStakeholderRegistration,
			project: {
				projectType,
				reference,
				status,
				title,
				groups,
			},
			resource: {
				resourceFileHTML,
				title: resource.title,
			},
		},
	};
};
