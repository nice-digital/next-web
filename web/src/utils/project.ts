import { type Redirect } from "next";

import {
	getProjectDetail,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			project: ProjectDetail;
	  };

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	resolvedUrl: string
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is project reference - something like "GID-TA11036"
	const projectId = params.slug,
		project = await getProjectDetail(projectId);

	if (!project) return { notFound: true };

	// if project status is complete it is not in development and should redirect to the published product
	//TODO getProduct path to make this re-useable for other product types
	if (project.status == ProjectStatus.Complete) {
		return {
			redirect: {
				destination: `/indicators/${project.reference}`,
				permanent: true,
			},
		};
	}

	return {
		project,
	};
};
