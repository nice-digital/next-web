import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	Project,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";
import { getProjectPath } from "@/utils/url";

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			project: ProjectDetail;
			projectPath: string | null;
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

	const panels = project
		? project.embedded.niceIndevPanelList.embedded.niceIndevPanel.filter(
				(panel) => panel.showPanel && panel.panelType == "History"
		  )
		: [];

	const projectPath = getProjectPath(project as Project);

	// if project status is complete it is not in development and should redirect to the published product
	if (project.status == ProjectStatus.Complete) {
		return {
			redirect: {
				destination: `${projectPath}`,
				permanent: true,
			},
		};
	}

	return {
		projectPath,
		project,
		panels,
		hasPanels: panels.length > 0,
	};
};
