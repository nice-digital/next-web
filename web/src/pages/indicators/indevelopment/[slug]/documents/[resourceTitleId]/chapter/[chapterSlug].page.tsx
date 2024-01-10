import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectDisplayWordConversion } from "@/components/ProjectDisplayWordConversion/ProjectDisplayWordConversion";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { ResourceLinkCard } from "@/components/ResourceLinkCard/ResourceLinkCard";
import {
	getConvertedDocumentHTML,
	getResourceFileHTML,
} from "@/feeds/inDev/inDev";
import {
	IndevFileResource,
	IndevSchedule,
	niceIndevConvertedDocumentChapter,
	niceIndevConvertedDocumentSection,
	ProjectDetail,
	resourceInPageNavLink,
} from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { generateInPageNavArray, validateRouteParams } from "@/utils/project";
import { getInDevResourceLink, ResourceLinkViewModel } from "@/utils/resource";

export type DocumentsChapterHTMLPageProps = {
	consultationUrls: string[];
	projectPath: string;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	>;
	resource: {
		isConvertedDocument: boolean;
		resourceFileHTML: string;
		resourceFileChapters: {
			allChapters: niceIndevConvertedDocumentChapter[];
			currentChapter: {
				title: string;
				sections?: niceIndevConvertedDocumentSection[];
			};
			currentUrl: string;
		};
		resourceInPageNavLinks: resourceInPageNavLink[];
		resourceFilePdfLink: string | null;
		resourceFileTitle: string;
	};
	resourceLinks: ResourceLinkViewModel[];
};

export default function DocumentsChapterHTMLPage({
	consultationUrls,
	project,
	indevStakeholderRegistration,
	projectPath,
	resource,
	indevScheduleItems,
	resourceLinks,
}: DocumentsChapterHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${resource.resourceFileTitle} | Project documents | ${project.reference} | Indicators | Standards and Indicators`}
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
					to={`/indicators/indevelopment/${project.reference.toLowerCase()}/documents`}
					elementType={Link}
				>
					Project documents
				</Breadcrumb>
				<Breadcrumb>{resource.resourceFileTitle}</Breadcrumb>
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

			{resource.isConvertedDocument ? (
				<ProjectDisplayWordConversion
					content={resource.resourceFileHTML}
					chapters={resource.resourceFileChapters.allChapters}
					inPageNavLinks={resource.resourceInPageNavLinks}
					pdfLink={resource.resourceFilePdfLink}
					currentChapter={resource.resourceFileChapters.currentChapter.title}
					currentUrl={resource.resourceFileChapters.currentUrl}
					resourceFileTitle={resource.resourceFileTitle}
					sections={resource.resourceFileChapters.currentChapter.sections}
				/>
			) : (
				<>
					<h2>{resource.resourceFileTitle}</h2>

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
			)}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentsChapterHTMLPageProps,
	{ slug: string; resourceTitleId: string; chapterSlug: string }
> = async ({ params, resolvedUrl, query }) => {
	if (!params?.resourceTitleId) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, projectPath, consultationUrls } = result;
	const { projectType, reference, status, title } = project;

	const chapterSlug =
		(Array.isArray(params.chapterSlug)
			? params.chapterSlug[0]
			: params.chapterSlug) || "";

	const resourceAndPanel = panels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
				.filter(
					(resource): resource is IndevFileResource =>
						!!resource.embedded?.niceIndevFile ||
						!!resource.embedded?.niceIndevConvertedDocument
				)
				.map((resource) => ({ panel, resource }))
		)
		.find(({ resource }) => {
			const resourceTitleId =
				resource.embedded.niceIndevFile?.resourceTitleId ||
				resource.embedded.niceIndevConvertedDocument?.resourceTitleId;

			return (
				resource.showInDocList && resourceTitleId === params.resourceTitleId
			);
		});

	if (!resourceAndPanel) {
		logger.info(`Could not find resource with id ${params.resourceTitleId}`);
		return { notFound: true };
	}

	const { panel, resource } = resourceAndPanel,
		resourceFileTitle = resource.title,
		indevFile = resource.embedded.niceIndevFile,
		indevConvertedDocument = resource.embedded.niceIndevConvertedDocument;

	let resourceFilePath, resourceFilePathHTMLIndex, resourceFileHTML;

	if (indevConvertedDocument) {
		resourceFilePath = indevConvertedDocument.links.self[0].href;
		resourceFilePathHTMLIndex = resourceFilePath.lastIndexOf("/html");
		resourceFilePath =
			resourceFilePathHTMLIndex > -1
				? `${resourceFilePath.slice(
						0,
						resourceFilePathHTMLIndex
				  )}/chapter/${chapterSlug}`
				: resourceFilePath;
		resourceFileHTML = await getConvertedDocumentHTML(resourceFilePath);
	}

	if (indevFile) {
		resourceFilePath = indevFile.links.self[0].href;
		resourceFileHTML = {
			content: await getResourceFileHTML(resourceFilePath),
		};
	}

	if (!resourceFileHTML || resourceFileHTML.content === null) {
		logger.warn(`Could not find resource HTML at ${resourceFilePath}`);
		return { notFound: true };
	}

	const resourceFileChapters = {
		allChapters: resourceFileHTML.chapters || [],
		currentChapter: {
			title: chapterSlug,
			sections: resourceFileHTML.sections,
		},
		currentUrl: `${projectPath}/documents/${params.resourceTitleId}`,
	};

	const sectionHeadingRegex = /<h3(.*)class="title"(.*)>((.|\s)+?)<\/h3>/g;
	const resourceInPageNavLinks = generateInPageNavArray(
		resourceFileHTML.content,
		sectionHeadingRegex
	);

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

	const resourceFilePdf = resourceLinks.filter(
		(resourceLink) =>
			resourceLink.fileTypeName === "PDF" &&
			resourceLink.title.replace("(pdf)", "").trim() === resourceFileTitle
	);

	const resourceFilePdfLink =
		resourceFilePdf.length > 0 ? resourceFilePdf[0].href : null;

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
				isConvertedDocument: !!indevConvertedDocument,
				resourceFileHTML: resourceFileHTML.content,
				resourceFileChapters,
				resourceInPageNavLinks,
				resourceFilePdfLink,
				resourceFileTitle,
			},
			resourceLinks,
		},
	};
};
