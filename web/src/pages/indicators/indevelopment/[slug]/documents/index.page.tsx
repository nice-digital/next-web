import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import {
	getInDevResourceLink,
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

export type DocumentsPageProps = {
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
};

export default function DocumentsPage(props: DocumentsPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Project documents | ${props.project.reference} | Indicators`}
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
			<ResourceList
				title="Project documents"
				lead="Documents created during the development process."
				groups={props.project.groups}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, panels, hasPanels, consultationUrls } = result,
		{ alert, projectType, reference, status, title, embedded, links } = project;

	if (!hasPanels) return { notFound: true };

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

				const convertedHtmlAlreadyInArray =
					resource.externalLinks && resource.externalLinks.length > 0
						? false
						: currentSubGroup.resourceLinks.some(
								(resourceLink) =>
									resourceLink.title ===
									resource.title.replace("(pdf)", "").trim()
						  );

				// don't show converted html pdf download docs here
				if (!convertedHtmlAlreadyInArray) {
					currentSubGroup.resourceLinks.push(
						...arrayify(getInDevResourceLink({ resource, panel, project }))
					);
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
		},
	};
};
