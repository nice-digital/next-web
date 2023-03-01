import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	Project,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { getProjectPath } from "@/utils/url";

import { arrayify } from "./array";

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			consultationUrls: string[];
			project: ProjectDetail;
			projectPath: string;
			panels: IndevPanel[];
			hasPanels: boolean;
	  };

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	_resolvedUrl: string
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is project reference - something like "GID-TA11036"
	const projectId = params.slug,
		project = await getProjectDetail(projectId);

	if (!project) return { notFound: true };

	const projectPath = getProjectPath(project as Project);

	if (!projectPath) return { notFound: true };

	// if project status is complete it is not in development and should redirect to the published product
	if (project.status == ProjectStatus.Complete) {
		return {
			redirect: {
				destination: `${projectPath}`,
				permanent: true,
			},
		};
	}

	const panels = project
		? arrayify(
				project.embedded.niceIndevPanelList.embedded.niceIndevPanel
		  ).filter((panel) => panel.showPanel && panel.panelType == "History")
		: [];

	const consultationUrls = panels
		.filter((panel) => panel.embedded.niceIndevConsultation)
		.flatMap((panel) => arrayify(panel.embedded.niceIndevConsultation))
		.map(
			(consultation) =>
				`${projectPath}/consultations/${consultation.resourceTitleId}`
		);

	return {
		consultationUrls,
		projectPath,
		project,
		panels,
		hasPanels: panels.length > 0,
	};
};
