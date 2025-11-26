import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ConvertedDocument } from "@/components/ConvertedDocument/ConvertedDocument";
import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { getConvertedDocumentHTML } from "@/feeds/inDev/inDev";
import {
	IndevFileResource,
	IndevSchedule,
	niceIndevConvertedDocumentChapter,
	niceIndevConvertedDocumentSection,
	ProjectDetail,
} from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { generateInPageNavArray, validateRouteParams } from "@/utils/project";
import { getInDevResourceLink } from "@/utils/resource";

export type DocumentsChapterHTMLPageProps = {
	consultationUrls: string[];
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	lastUpdated: string;
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	>;
	projectPath: string;
	resource: {
		chapters: niceIndevConvertedDocumentChapter[];
		htmlBody: string;
		isConvertedDocument: boolean;
		pdfDownloadLink: string | null;
		sections?: niceIndevConvertedDocumentSection[];
		title: string;
	};
};

export default function DocumentsChapterHTMLPage({
	consultationUrls,
	indevScheduleItems,
	indevStakeholderRegistration,
	lastUpdated,
	project,
	projectPath,
	resource,
}: DocumentsChapterHTMLPageProps): JSX.Element {
	const { title } = resource;

	return (
		<>
			<NextSeo
				title={`${title} | Project documents | ${project.reference} | Indicators`}
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
				<Breadcrumb>{title}</Breadcrumb>
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

			<ConvertedDocument lastUpdated={lastUpdated} resource={resource} />
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

	if (!resourceFileHTML || resourceFileHTML.content === null) {
		logger.warn(`Could not find resource HTML at ${resourceFilePath}`);
		return { notFound: true };
	}

	const sectionHeadingRegex = /<h3(.*)class="title"(.*)>((.|\s)+?)<\/h3>/g;
	const sections = generateInPageNavArray(
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

	const pdfDownload = resourceLinks.filter(
		(resourceLink) =>
			resourceLink.fileTypeName === "PDF" &&
			resourceLink.title.replace("(pdf)", "").trim() === resource.title
	);

	const pdfDownloadLink = pdfDownload.length > 0 ? pdfDownload[0].href : null;

	return {
		props: {
			consultationUrls,
			indevScheduleItems,
			indevStakeholderRegistration,
			lastUpdated: resource.publishedDate,
			projectPath,
			project: {
				projectType,
				reference,
				status,
				title,
			},
			resource: {
				chapters: resourceFileHTML.chapters || [],
				htmlBody: resourceFileHTML.content,
				isConvertedDocument: !!indevConvertedDocument,
				pdfDownloadLink,
				sections: sections,
				title: resource.title,
			},
		},
	};
};
