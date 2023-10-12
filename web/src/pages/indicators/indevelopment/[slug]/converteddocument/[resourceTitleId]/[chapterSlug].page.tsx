import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectDisplayWordConversion } from "@/components/ProjectDisplayWordConversion/ProjectDisplayWordConversion";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { getConvertedDocumentHTML } from "@/feeds/inDev/inDev";
import {
	IndevSchedule,
	ProjectDetail,
	niceIndevConvertedDocument,
} from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import {
	getInDevResourceLink,
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

export type ConvertedDocumentPageProps = {
	alert: string | null;
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
	convertedDocumentHTML: niceIndevConvertedDocument & {
		currentChapter: string;
		currentUrl: string;
	};
};

export default function ConvertedDocumentPage(
	props: ConvertedDocumentPageProps
): JSX.Element {
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
			{props.alert && (
				<div
					className="alert-message"
					dangerouslySetInnerHTML={{ __html: props.alert }}
				/>
			)}
			<ProjectHorizontalNav
				projectPath={props.projectPath}
				hasDocuments
				consultationUrls={props.consultationUrls}
			/>
			<ProjectDisplayWordConversion
				content={props.convertedDocumentHTML.content}
				sections={props.convertedDocumentHTML.sections}
				currentChapter={props.convertedDocumentHTML.currentChapter}
				currentUrl={props.convertedDocumentHTML.currentUrl}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	ConvertedDocumentPageProps,
	{ slug: string; resourceTitleId: string; chapterSlug: string }
> = async ({ params, resolvedUrl, query }) => {
	if (!params?.resourceTitleId) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, panels, hasPanels, consultationUrls } = result,
		{ alert, projectType, reference, status, title, embedded, links } = project;

	if (!hasPanels) return { notFound: true };

	const chapterSlug =
		(Array.isArray(params.chapterSlug)
			? params.chapterSlug[0]
			: params.chapterSlug) || "";

	const convertedDocumentHTML = await getConvertedDocumentHTML(
		`/guidance/${params.slug}/converteddocument/${params.resourceTitleId}${
			chapterSlug !== "index" ? `?slug=${chapterSlug}` : ""
		}`
	);

	if (!convertedDocumentHTML || convertedDocumentHTML.content === null) {
		logger.warn(
			`Could not find converted document with id ${params.resourceTitleId}`
		);
		return { notFound: true };
	}

	const currentUrl = `${projectPath}/converteddocument/${
		params.resourceTitleId
	}${chapterSlug ? `/${chapterSlug}` : ""}`;

	const indevSchedule =
			embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			links.niceIndevStakeholderRegistration
		);

	const groups = panels.sort(byTitleAlphabetically).map((panel) => {
		const allPanelResources =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource,
			resourcesToShow = arrayify(allPanelResources).filter(
				(resource) => resource.showInDocList
			),
			subGroups: ResourceSubGroupViewModel[] = [];

		let currentSubGroup: ResourceSubGroupViewModel;

		resourcesToShow.forEach((resource) => {
			if (resource.textOnly) {
				currentSubGroup = { title: resource.title, resourceLinks: [] };
				subGroups.push(currentSubGroup);
			} else {
				if (!currentSubGroup) {
					currentSubGroup = { title: panel.title, resourceLinks: [] };
					subGroups.push(currentSubGroup);
				}

				currentSubGroup.resourceLinks.push(
					getInDevResourceLink({ resource, panel, project })
				);
			}
		});

		return {
			title: panel.title,
			subGroups,
		};
	});

	return {
		props: {
			alert,
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
			convertedDocumentHTML: {
				content: convertedDocumentHTML.content,
				sections: convertedDocumentHTML.sections,
				currentChapter: chapterSlug,
				currentUrl: currentUrl,
			},
		},
	};
};
