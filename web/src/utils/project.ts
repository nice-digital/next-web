import { type Redirect } from "next";

import {
	getProjectDetail,
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
	  };

export const validateRouteParams = async (
	params: { slug: string } | undefined
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is project reference - something like "GID-TA11036"
	const projectId = params.slug,
		project = await getProjectDetail(projectId);

	if (!project) return { notFound: true };

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
	};
};
