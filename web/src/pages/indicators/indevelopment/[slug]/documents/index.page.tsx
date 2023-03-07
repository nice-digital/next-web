import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/project";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

export type DocumentsPageProps = {
	consultationUrls: string[];
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	projectPath: string;
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	> & {
		groups: ResourceGroupViewModel[];
	};
};

export default function DocumentsPage(props: DocumentsPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Project documents | ${props.project.reference} | Indicators | Standards and Indicators`}
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
					to={`/indicators/indevelopment/${props.project.reference.toLowerCase()}`}
					elementType={Link}
				>
					{props.project.reference}
				</Breadcrumb>
				<Breadcrumb>Project documents</Breadcrumb>
			</Breadcrumbs>

			<ProjectPageHeading
				projectPath={props.projectPath}
				projectType={props.project.projectType}
				reference={props.project.reference}
				title={props.project.title}
				status={props.project.status}
				indevScheduleItems={props.indevScheduleItems}
				indevStakeholderRegistration={props.indevStakeholderRegistration}
			/>

			<ProjectHorizontalNav
				projectPath={props.projectPath}
				hasDocuments
				consultationUrls={props.consultationUrls}
			/>

			<ResourceList
				title="Project documents"
				lead="A list of downloadable documents created during development."
				groups={props.project.groups}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams({ params, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		project: { projectType, reference, status, title, embedded, links },
		projectPath,
		panels,
		hasPanels,
		consultationUrls,
	} = result;

	if (!hasPanels) return { notFound: true };

	const indevSchedule =
			embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			links.niceIndevStakeholderRegistration
		);

	const groups = panels.sort(byTitleAlphabetically).map((panel) => {
		const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource,
			indevResources = arrayify(indevResource).filter(
				(resource) => resource.showInDocList
			),
			subGroups: ResourceSubGroupViewModel[] = [];

		let currentSubGroup: ResourceSubGroupViewModel;

		indevResources.forEach((resource) => {
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
						isConsultation = resource.consultationId > 0,
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
			consultationUrls,
			indevScheduleItems,
			indevStakeholderRegistration,
			projectPath,
			project: {
				projectType,
				reference,
				status,
				title,
				groups,
			},
		},
	};
};
