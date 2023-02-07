import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";

import { getProductPath } from "./url";

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			project: ProjectDetail;
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
				(panel) => panel.showPanel
		  )
		: [];

	const productPath = getProductPath({
		productGroup: ProductGroup.Other,
		id: project.reference,
		productType: ProductTypeAcronym.IND,
		title: "",
	});

	// if project status is complete it is not in development and should redirect to the published product
	if (project.status == ProjectStatus.Complete) {
		return {
			redirect: {
				destination: `${productPath}`,
				permanent: true,
			},
		};
	}

	return {
		project,
		panels,
		hasPanels: panels.length > 0,
	};
};
