import { ParsedUrlQuery } from "querystring";

import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevConsultationPanel,
	IndevPanel,
	ProjectDetail,
	ProjectStatus,
} from "@/feeds/inDev/inDev";
import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";
import { logger } from "@/logger";
import { getProjectPath, getProductPath } from "@/utils/url";

import { arrayify } from "./array";

export type ValidateRouteParamsArgs = {
	params: { slug: string } | undefined;
	resolvedUrl: string;
	query: ParsedUrlQuery;
};
export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			consultationPanels: IndevConsultationPanel[];
			consultationUrls: string[];
			project: ProjectDetail;
			projectPath: string;
			panels: IndevPanel[];
			hasPanels: boolean;
	  };

export const validateRouteParams = async ({
	params,
	resolvedUrl,
	query,
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
			productGroup: project.projectGroup as unknown as ProductGroup,
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

	const absoluteURL = new URL(resolvedUrl, `https://anything.com`),
		actualPathSegments = absoluteURL.pathname.split("/"),
		expectedPathSegments = projectPath.split("/");

	if (!query.productRoot || Array.isArray(query.productRoot))
		throw Error(
			"No product root present in the URL. Is something wrong with the async rewrites?"
		);

	if (!query.statusSlug || Array.isArray(query.statusSlug))
		throw Error(
			"No status slug present in the URL. Is something wrong with the async rewrites?"
		);

	// We rewrite URLs (guidance/advice/process/corporate) to the same page-serving code.
	// See next.config.js for the rewrites.
	// So we have a `productRoot` query param in the rewritten URL
	const productRoot =
			absoluteURL.searchParams.get("productRoot") || query.productRoot,
		statusSlug = absoluteURL.searchParams.get("statusSlug") || query.statusSlug;

	// Remove the query param from ending up in redirect URLs
	absoluteURL.searchParams.delete("productRoot");
	absoluteURL.searchParams.delete("statusSlug");

	// The resolved url is the static path of the filesystem because of the rewrites, so replace the path segment with the actual product root (guidance/advice/process/corporate/indicators)
	actualPathSegments[1] = productRoot;
	actualPathSegments[2] = statusSlug;

	if (
		expectedPathSegments.some((segment, i) => segment !== actualPathSegments[i])
	) {
		// All 'project' URLs follow a format like "/indicators/indevelopment/ind1/anything/here"
		// So by replacing the slug (2nd) segment we can support redirects to pages at any level
		// For example from "/indicators/indevelopment/ind1/anything/here" to /indicators/discontinued/ind1/anything/here

		// Retain the 'search' (querystring) part of the URL to retain things like utm params if present
		const destination =
			actualPathSegments
				.map((segment, i) => expectedPathSegments[i] ?? segment)
				.join("/") + absoluteURL.search;

		logger.info(`Redirecting from ${absoluteURL.pathname} to ${destination}`);

		return {
			redirect: {
				destination: destination,
				permanent: true,
			},
		};
	}

	const panels = project
			? arrayify(
					project.embedded?.niceIndevPanelList?.embedded?.niceIndevPanel
			  ).filter((panel) => panel.showPanel && panel.panelType == "History")
			: [],
		consultationPanels = panels.filter(
			(panel) =>
				panel.embedded.niceIndevConsultation &&
				!panel.embedded.niceIndevConsultation.hidden
		) as IndevConsultationPanel[];

	const consultationUrls = consultationPanels.map(
		(panel) =>
			`${projectPath}/consultations/${panel.embedded.niceIndevConsultation.resourceTitleId}`
	);

	return {
		consultationUrls,
		consultationPanels,
		projectPath,
		project,
		panels,
		hasPanels: panels.length > 0,
	};
};
