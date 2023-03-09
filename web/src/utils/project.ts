import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevConsultation,
	IndevPanel,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { ProductTypeAcronym } from "@/feeds/publications/types";
import { getProjectPath, getProductPath } from "@/utils/url";

import { arrayify } from "./array";

export type ValidateRouteParamsArgs = {
	params: { slug: string } | undefined;
	resolvedUrl: string;
};
export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			consultations: IndevConsultation[];
			shouldUseNewConsultationComments: boolean;
			consultationUrls: string[];
			project: ProjectDetail;
			projectPath: string;
			panels: IndevPanel[];
			hasPanels: boolean;
	  };

export const validateRouteParams = async ({
	params,
	resolvedUrl,
}: ValidateRouteParamsArgs): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is project reference - something like "GID-TA11036"
	const projectId = params.slug,
		project = await getProjectDetail(projectId);

	if (!project) return { notFound: true };

	const projectPath = getProjectPath(project);

	if (!projectPath) return { notFound: true };

	// if project status is complete it is not in development and should redirect to the published product
	if (project.status == ProjectStatus.Complete) {
		const productPath = getProductPath({
			productGroup: project.projectGroup,
			id: project.reference,
			productType: project.projectType as unknown as ProductTypeAcronym,
			title: project.title,
		});

		return {
			redirect: {
				destination: `${productPath}`,
				permanent: true,
			},
		};
	}

	const panels = project
			? arrayify(
					project.embedded?.niceIndevPanelList?.embedded?.niceIndevPanel
			  ).filter((panel) => panel.showPanel && panel.panelType == "History")
			: [],
		consultations = panels
			.flatMap((panel) => arrayify(panel.embedded.niceIndevConsultation))
			.filter((consultation) => !consultation.hidden);

	const consultationUrls = consultations.map(
		(consultation) =>
			`${projectPath}/consultations/${consultation.resourceTitleId}`
	);

	let shouldUseNewConsultationComments = false;

	panels.map((panel) => {
		const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource,
			indevResources = arrayify(indevResource).filter(
				(resource) => resource.showInDocList
			);

		indevResources.forEach((resource) => {
			shouldUseNewConsultationComments =
				resource.convertedDocument ||
				resource.supportsComments ||
				resource.supportsQuestions ||
				false;
		});
	});

	return {
		shouldUseNewConsultationComments: true,
		consultationUrls,
		consultations,
		projectPath,
		project,
		panels,
		hasPanels: panels.length > 0,
	};
};
