import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { ResourceLinkCard } from "@/components/ResourceLinkCard/ResourceLinkCard";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import {
	IndevFileResource,
	IndevSchedule,
	ProjectDetail,
} from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import { getInDevResourceLink, ResourceLinkViewModel } from "@/utils/resource";

export type DocumentHTMLPageProps = {
	consultationUrls: string[];
	projectPath: string;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	>;
	resource: {
		resourceFileHTML: string;
		title: string;
	};
	resourceLinks: ResourceLinkViewModel[];
};

export default function DocumentsHTMLPage({
	consultationUrls,
	project,
	indevStakeholderRegistration,
	projectPath,
	resource,
	indevScheduleItems,
	resourceLinks,
}: DocumentHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${resource.title} | Project documents | ${project.reference} | Indicators`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
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
					to={`/indicators/indevelopment/${project.reference.toLowerCase()}/documents`}
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

			<h2>{resource.title}</h2>

			{resource.resourceFileHTML && (
				<div
					dangerouslySetInnerHTML={{ __html: resource.resourceFileHTML }}
				></div>
			)}

			{resourceLinks.length > 0 ? (
				<>
					<ul className="list list--unstyled">
						{resourceLinks.map((resourceLink) => (
							<li key={resourceLink.href}>
								<ResourceLinkCard resourceLink={resourceLink} />
							</li>
						))}
					</ul>
				</>
			) : null}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentHTMLPageProps,
	{ slug: string; resourceTitleId: string }
> = async ({ params, resolvedUrl, query }) => {
	if (!params?.resourceTitleId) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, projectPath, consultationUrls } = result;

	const resourceAndPanel = panels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
				.filter(
					(resource): resource is IndevFileResource =>
						!!resource.embedded?.niceIndevFile
				)
				.map((resource) => ({ panel, resource }))
		)
		.find(
			({ resource }) =>
				resource.showInDocList &&
				resource.embedded.niceIndevFile.resourceTitleId ===
					params.resourceTitleId
		);

	if (!resourceAndPanel) {
		logger.info(`Could not find resource with id ${params.resourceTitleId}`);
		return { notFound: true };
	}

	const { panel, resource } = resourceAndPanel,
		resourceFilePath = resource.embedded.niceIndevFile.links.self[0].href,
		resourceFileHTML = await getResourceFileHTML(resourceFilePath);

	if (resourceFileHTML == null) {
		logger.warn(`Could not find resource HTML at ${resourceFilePath}`);
		return { notFound: true };
	}

	const { projectType, reference, status, title } = project;

	const indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		),
		otherResources = arrayify(
			panel.embedded.niceIndevResourceList.embedded.niceIndevResource
		).filter((r) => r !== resource && !r.textOnly),
		resourceLinks = otherResources.map((resource) =>
			getInDevResourceLink({ resource, project, panel })
		);

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
			},
			resource: {
				resourceFileHTML,
				title: resource.title,
			},
			resourceLinks,
		},
	};
};
