import { ParsedUrlQuery } from "querystring";

import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	ProjectDetail,
} from "@/feeds/inDev/inDev";
import {
	getAllProductTypes,
	getProductDetail,
} from "@/feeds/publications/publications";
import {
	type ProductDetail,
	type ChapterHeading,
	type UploadAndConvertContentPart,
	ProductGroup,
	Status,
	ResourceGroupType,
	ProductType,
	RelatedResourceList,
} from "@/feeds/publications/types";
import {
	getTaxonomyProductMappings,
	TaxonomyBreadcrumb,
	TaxonomyBreadcrumbObject,
	TaxonomyProductMappings,
} from "@/feeds/taxonomy/taxonomy";
import { logger } from "@/logger";
import { getProductPath, getPublicationPdfDownloadPath } from "@/utils/url";

import { arrayify } from "./array";
import { fetchAndMapContentParts } from "./contentparts";

/** The title of the overview page */
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
	if (!product.contentPartsList) return null;

	const contentParts = product.contentPartsList;

	const uploadAndConvertContentPart =
		fetchAndMapContentParts<UploadAndConvertContentPart>(
			contentParts,
			"UploadAndConvertContentPart"
		);

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

	const chapterInfos = arrayify(part.tableOfContents),
		productPath = getProductPath({
			...product,
			productGroup,
		});

	const isOverview = !(
		product.summary === null &&
		(product.endorsementList?.length ?? 0) == 0 &&
		(product.supportingList?.length ?? 0) == 0 &&
		(product.additionalAuthorList?.length ?? 0) == 0
	);

	return [
		...(isOverview
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
				url: `${productPath}/chapter/${chapterSlug}`,
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
	toolsAndResources: RelatedResourceList[];
	hasToolsAndResources: boolean;
	evidenceResources: RelatedResourceList[];
	hasEvidenceResources: boolean;
	infoForPublicResources: RelatedResourceList[];
	hasInfoForPublicResources: boolean;
	project: ProjectDetail | null;
	historyPanels: IndevPanel[];
	hasHistory: boolean;
	taxonomyBreadcrumb: TaxonomyBreadcrumb[];
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

	const [product, allProductTypes, taxonomyProductMappings] = await Promise.all(
		[
			getProductDetail(productId),
			getAllProductTypes(),
			getTaxonomyProductMappings(),
		]
	);

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

	let taxonomyProductMappingsFallback = taxonomyProductMappings;

	if (!taxonomyProductMappings) {
		logger.info(`Product type ${product.productType} not found`);
		taxonomyProductMappingsFallback = {} as TaxonomyProductMappings;
	}

	const productPath = getProductPath({
			...product,
			productGroup: productType.group,
		}),
		toolsAndResources = getPublishedToolsAndResources(product),
		evidenceResources = getPublishedEvidenceResources(product),
		infoForPublicResources = getPublishedIFPResources(product),
		taxonomyBreadcrumb =
			Object.keys(taxonomyProductMappingsFallback).length > 0
				? getTaxonomyBreadcrumb(taxonomyProductMappingsFallback, product)
				: [];

	const project = product.inDevReference
		? await getProjectDetail(product.inDevReference)
		: null;

	const historyPanels = project
		? arrayify(
				project.embedded?.niceIndevPanelList?.embedded?.niceIndevPanel
		  ).filter((panel) => panel.showPanel && panel.panelType == "History")
		: [];

	const absoluteURL = new URL(resolvedUrl, `https://anything.com`),
		actualPathSegments = absoluteURL.pathname.split("/"),
		expectedPathSegments = productPath.split("/");

	const status = product.productStatus,
		retiredOrTerminated = [Status.Retired, Status.Terminated],
		statusIsRetiredOrTerminated = retiredOrTerminated.includes(status),
		retiredOrTerminatedInUrl = actualPathSegments[2] === status.toLowerCase(); // must be same status

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
				productType.group,
				product.lastModified
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
			taxonomyBreadcrumb,
		};

	// All 'product' URLs follow a format like "/indicators/ind1-some-title/anything/here"
	// So by replacing the slug (2nd) segment we can support redirects to pages at any level
	// For example from "/indicators/ind1-wrong-title/anything/here" to /indicators/ind1-correct-title/anything/here

	if (statusIsRetiredOrTerminated !== retiredOrTerminatedInUrl) {
		if (statusIsRetiredOrTerminated) {
			actualPathSegments.splice(2, 0, status.toLowerCase());
			actualPathSegments.splice(4);
		} else {
			actualPathSegments.splice(2, 1);
		}
	}

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

export const redirectWithdrawnProducts = (
	product: ProductDetail,
	productPath: string,
	permanent = true
): { redirect: Redirect } | false => {
	const isFullyWithdrawn = product.productStatus === "Withdrawn";
	const isTempWithdrawn = product.productStatus === "TemporarilyWithdrawn";

	if (isFullyWithdrawn || isTempWithdrawn) {
		logger.info(
			`Product with id ${product.id} has '${product.productStatus}' status`
		);
		return {
			redirect: {
				permanent: permanent,
				destination: productPath,
			},
		};
	}

	return false;
};

/**
 * Extracts the related resources from a product, if there are any
 *
 * @param product The full product response from publicaitons
 * @returns An array of related resources
 */
export const getPublishedRelatedResources = (
	product: ProductDetail
): RelatedResourceList[] =>
	arrayify(product.relatedResourceList).filter(
		({ status }) => status === Status.Published
	);

/**
 * Extracts a list of published related resources for the 'tools and resources' section of a product.
 * That is, resources that aren't evidence and aren't information for the public (evidence and IFP have their own tabs).
 *
 * @param product The product on which to find resources
 * @returns A list of published tools and resources
 */
export const getPublishedToolsAndResources = (
	product: ProductDetail
): RelatedResourceList[] =>
	getPublishedRelatedResources(product).filter((resource) => {
		const groupName = resource.resourceGroupsList?.[0] || "";

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
): RelatedResourceList[] =>
	getPublishedRelatedResources(product).filter(
		(resource) =>
			(resource.resourceGroupsList?.[0] || "") === ResourceGroupType.Evidence
	);

/**
 *	Extracts a list of published related resources for the 'IFP' section of a product. That is, resources with a group of 'InformationForThePublic'.
 *
 * @param product The product on which which to find IFP resources
 * @returns A list of published IFP resources
 */
export const getPublishedIFPResources = (
	product: ProductDetail
): RelatedResourceList[] =>
	getPublishedRelatedResources(product).filter(
		(resource) =>
			(resource.resourceGroupsList?.[0] || "") ===
			ResourceGroupType.InformationForThePublic
	);

/**
 * Extracts related product taxonomy into a breadcrumnb, if there is any
 *
 * @param taxonomyProductMappings The full topicBrowseProductMappings response from taxonomy service
 * @param product The full product response from publicaitons
 * @returns An array of breadcrumb objects - titles and urls
 */
export const getTaxonomyBreadcrumb = (
	taxonomyProductMappings: TaxonomyProductMappings,
	product: ProductDetail
): TaxonomyBreadcrumb[] => {
	const targetProductId = product.id;
	const results = [] as TaxonomyBreadcrumbObject[];

	function traverse(
		node: TaxonomyProductMappings,
		path = [] as TaxonomyBreadcrumb[]
	) {
		if (!node || typeof node !== "object") return;

		const currentItem = {
			title: node.name,
			url: node.slug ? `/${node.slug.replace(/\/$/, "")}` : "", // clean trailing slash
		};

		const currentPath = [...path, currentItem];

		// Check if this node has a productIds array containing any of the targets
		if (Array.isArray(node.productIds)) {
			const matchingProducts = node.productIds.filter(
				(id: string) => targetProductId === id
			);

			if (matchingProducts.length > 0) {
				results.push({
					breadcrumb: currentPath,
				});
			}
		}

		// Recurse into child categories
		if (Array.isArray(node.categories)) {
			for (const child of node.categories) {
				traverse(child, currentPath);
			}
		}
	}

	traverse(taxonomyProductMappings);

	// get first object/result from array and return breadcrumb array from the same object
	const breadcrumbArray = results.length ? results[0].breadcrumb : [];

	return breadcrumbArray;
};
