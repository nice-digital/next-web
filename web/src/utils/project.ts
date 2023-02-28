import { type Redirect } from "next";

import {
	getProjectDetail,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { ProductTypeAcronym } from "@/feeds/publications/types";

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

	return {
		project,
	};
};

//TODO Delete comments below

// import { type Redirect } from "next";

// import {
// 	getProjectDetail,
// 	ProjectDetail,
// 	ProjectStatus,
// } from "@/feeds/inDev/inDev";
// import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";

// import { getProductPath } from "./url";

// export type ValidateRouteParamsArgs = {
// 	params: { slug: string } | undefined;
// 	_resolvedUrl: string;
// };

// export type ValidateRouteParamsResult =
// 	| { notFound: true }
// 	| { redirect: Redirect }
// 	| {
// 			project: ProjectDetail;
// 	  };

// export const validateRouteParams = async ({
// 	params,
// 	_resolvedUrl,
// }: ValidateRouteParamsArgs): Promise<ValidateRouteParamsResult> => {
// 	if (!params || !params.slug) return { notFound: true };

// 	// Slug is project reference - something like "GID-TA11036"
// 	const projectId = params.slug,
// 		project = await getProjectDetail(projectId);

// 	if (!project) return { notFound: true };

// 	if (project.status == ProjectStatus.Complete) {
// 		const productPath = getProductPath({
// 			productGroup: project.projectGroup,
// 			id: project.reference,
// 			productType: project.projectType as unknown as ProductTypeAcronym,
// 			title: project.title,
// 		});

// 		return {
// 			redirect: {
// 				destination: `${productPath}`,
// 				permanent: true,
// 			},
// 		};
// 	}

// 	return {
// 		project,
// 	};
// };
