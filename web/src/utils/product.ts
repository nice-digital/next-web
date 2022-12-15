import { ParsedUrlQuery } from "querystring";

import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	ProjectDetail,
} from "@/feeds/inDev/inDev";
import {
	getProductDetail,
	getAllProductTypes,
} from "@/feeds/publications/publications";
import {
	type ProductDetail,
	type ChapterHeading,
	type UploadAndConvertContentPart,
	ProductGroup,
	Status,
	ResourceGroupType,
	RelatedResource,
	ProductType,
} from "@/feeds/publications/types";
import { logger } from "@/logger";
import { getProductPath, getPublicationPdfDownloadPath } from "@/utils/url";

import { arrayify } from "./array";

/** The title of the ovreview page */
export const overviewTitle = "Overview";

/**
 * Finds the first upload and convert part from the content part list in the give product
 *
 * @param product The product details
 * @returns The first upload and convert part if there is one, otherwise null
 */
export const getFirstUploadAndConvertPart = (
	product: ProductDetail
): UploadAndConvertContentPart | null => {
	if (!product.embedded.contentPartList) return null;

	const { uploadAndConvertContentPart } =
		product.embedded.contentPartList.embedded;

	return Array.isArray(uploadAndConvertContentPart)
		? uploadAndConvertContentPart[0]
		: uploadAndConvertContentPart ?? null;
};

export const getChapterLinks = (
	product: ProductDetail,
	productGroup: ProductGroup
): ChapterHeading[] => {
	const part = getFirstUploadAndConvertPart(product);

	if (!part) return [];

	const chapterInfos = arrayify(
			part.embedded.htmlContent.embedded?.htmlChapterContentInfo
		),
		productPath = getProductPath({
			...product,
			productGroup,
		});

	return [
		...(product.summary
			? [
					{
						title: overviewTitle,
						url: productPath,
					},
			  ]
			: []),
		...chapterInfos
			.filter(({ title }) => title !== overviewTitle || !product.summary)
			.map(({ title, chapterSlug }) => ({
				title,
				url: `${productPath}/chapters/${chapterSlug}`,
			})),
	];
};

export type ValidateRouteParamsArgs = {
	params: { slug: string } | undefined;
	resolvedUrl: string;
	query: ParsedUrlQuery;
};

export type ValidateRouteParamsSuccess = {
	actualPath: string;
	product: ProductDetail;
	productType: ProductType;
	productPath: string;
	pdfDownloadPath: string | null;
	toolsAndResources: RelatedResource[];
	hasToolsAndResources: boolean;
	evidenceResources: RelatedResource[];
	hasEvidenceResources: boolean;
	infoForPublicResources: RelatedResource[];
	hasInfoForPublicResources: boolean;
	project: ProjectDetail | null;
	historyPanels: IndevPanel[];
	hasHistory: boolean;
};

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| ValidateRouteParamsSuccess;

export const validateRouteParams = async ({
	params,
	resolvedUrl,
	query,
}: ValidateRouteParamsArgs): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is something like "NG100" or "IND123-a-slugified-title"
	const productId = params.slug.split("-")[0];

	const [product, allProductTypes] = await Promise.all([
		getProductDetail(productId),
		getAllProductTypes(),
	]);

	if (!product) {
		logger.info(`Product with id ${productId} could not be found`);
		return { notFound: true };
	}

	const productType = allProductTypes.find(
		(t) => t.enabled && t.identifierPrefix === product.productType
	);

	if (!productType) {
		logger.info(`Product type ${product.productType} not found`);
		return { notFound: true };
	}

	const productPath = getProductPath({
			...product,
			productGroup: productType.group,
		}),
		toolsAndResources = getPublishedToolsAndResources(product),
		evidenceResources = getPublishedEvidenceResources(product),
		infoForPublicResources = getPublishedIFPResources(product);

	const project = product.inDevReference
		? await getProjectDetail(product.inDevReference)
		: null;

	const historyPanels = project
		? project.embedded.niceIndevPanelList.embedded.niceIndevPanel.filter(
				(panel) => panel.showPanel && panel.panelType == "History"
		  )
		: [];

	const absoluteURL = new URL(resolvedUrl, `https://anything.com`),
		actualPathSegments = absoluteURL.pathname.split("/"),
		expectedPathSegments = productPath.split("/");

	if (!query.productRoot || Array.isArray(query.productRoot))
		throw Error(
			"No product root present in the URL. Is something wrong with the async rewrites?"
		);

	// We rewrite URLs (guidance/advice/process/corporate) to the same page-serving code.
	// See next.config.js for the rewrites.
	// So we have a `productRoot` query param in the rewritten URL
	const productRoot =
		absoluteURL.searchParams.get("productRoot") || query.productRoot;

	// Remove the query param from ending up in redirect URLs
	absoluteURL.searchParams.delete("productRoot");

	// The resolved url is the static path of the filesystem because of the rewrites, so replace the path segment with the actual product root (guidance/advice/process/corporate/indicators)
	actualPathSegments[1] = productRoot;

	if (
		expectedPathSegments.every(
			(segment, i) => segment === actualPathSegments[i]
		)
	)
		return {
			actualPath: actualPathSegments.join("/"),
			product,
			productType,
			productPath,
			pdfDownloadPath: getPublicationPdfDownloadPath(
				product,
				productType.group
			),
			toolsAndResources,
			hasToolsAndResources: toolsAndResources.length > 0,
			evidenceResources,
			hasEvidenceResources: evidenceResources.length > 0,
			infoForPublicResources,
			hasInfoForPublicResources: infoForPublicResources.length > 0,
			project,
			historyPanels,
			hasHistory: historyPanels.length > 0,
		};

	// All 'product' URLs follow a format like "/indicators/ind1-some-title/anything/here"
	// So by replacing the slug (2nd) segment we can support redirects to pages at any level
	// For example from "/indicators/ind1-wrong-title/anything/here" to /indicators/ind1-correct-title/anything/here

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
};

/**
 * Extracts the related resources from a product, if there are any
 *
 * @param product The full product response from publicaitons
 * @returns An array of related resources
 */
export const getPublishedRelatedResources = (
	product: ProductDetail
): RelatedResource[] =>
	arrayify(
		product.embedded.relatedResourceList?.embedded?.relatedResource
	).filter(({ status }) => status === Status.Published);

/**
 * Extracts a list of published related resources for the 'tools and resources' section of a product.
 * That is, resources that aren't evidence and aren't information for the public (evidence and IFP have their own tabs).
 *
 * @param product The product on which to find resources
 * @returns A list of published tools and resources
 */
export const getPublishedToolsAndResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter((resource) => {
		const groupName =
			resource.embedded.resourceGroupList.embedded.resourceGroup.name;

		return (
			groupName !== ResourceGroupType.Evidence &&
			groupName !== ResourceGroupType.InformationForThePublic
		);
	});

/**
 *	Extracts a list of published related resources for the 'evidence' section of a product. That is, resources with a group of 'Evidence'.
 *
 * @param product The product on which which to find evidence resources
 * @returns A list of published evidence resources
 */
export const getPublishedEvidenceResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter(
		(resource) =>
			resource.embedded.resourceGroupList.embedded.resourceGroup.name ===
			ResourceGroupType.Evidence
	);

/**
 *	Extracts a list of published related resources for the 'IFP' section of a product. That is, resources with a group of 'InformationForThePublic'.
 *
 * @param product The product on which which to find IFP resources
 * @returns A list of published IFP resources
 */
export const getPublishedIFPResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter(
		(resource) =>
			resource.embedded.resourceGroupList.embedded.resourceGroup.name ===
			ResourceGroupType.InformationForThePublic
	);
