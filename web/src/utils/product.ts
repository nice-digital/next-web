import { type Redirect } from "next";

import {
	getProjectDetail,
	IndevPanel,
	ProjectDetail,
} from "@/feeds/inDev/inDev";
import { getProductDetail } from "@/feeds/publications/publications";
import {
	type ProductDetail,
	type ChapterHeading,
	type UploadAndConvertContentPart,
	ProductGroup,
	Status,
	ResourceGroupType,
	RelatedResource,
} from "@/feeds/publications/types";
import { getProductPath, getProductSlug } from "@/utils/url";

import { arrayify } from "./array";

/** The product group for indicators. Needed because product details responses don't include the group. */
const productGroup = ProductGroup.Other;

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

export const getChapterLinks = (product: ProductDetail): ChapterHeading[] => {
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

export type ValidateRouteParamsResult =
	| { notFound: true }
	| { redirect: Redirect }
	| {
			product: ProductDetail;
			productPath: string;
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

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	resolvedUrl: string
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	// Slug is something like "NG100" or "IND123-a-slugified-title"
	const productId = params.slug.split("-")[0],
		product = await getProductDetail(productId);

	if (!product) return { notFound: true };

	const expectedSlug = getProductSlug(product),
		toolsAndResources = getPublishedToolsAndResources(product),
		evidenceResources = getPublishedEvidenceResources(product),
		infoForPublicResources = getPublishedIFPResources(product);

	//TODO make hardcoded project reference dynamic
	const project = await getProjectDetail("GID-NG10014");
	// const project = await getProjectDetail(product.inDevReference);

	if (!project) return { notFound: true };

	const hasHistory =
		project.embedded.niceIndevPanelList.embedded.niceIndevPanel.some(
			(panel) => panel.panelType == "History"
		);

	const historyPanels =
		project.embedded.niceIndevPanelList.embedded.niceIndevPanel.filter(
			(panel) => panel.showPanel && panel.panelType == "History"
		);

	if (params.slug === expectedSlug)
		return {
			product,
			productPath: getProductPath({
				...product,
				productGroup: ProductGroup.Other,
			}),
			toolsAndResources,
			hasToolsAndResources: toolsAndResources.length > 0,
			evidenceResources,
			hasEvidenceResources: evidenceResources.length > 0,
			infoForPublicResources,
			hasInfoForPublicResources: infoForPublicResources.length > 0,
			project,
			historyPanels,
			// TODO: Load the indev project to determine whether we have history or not
			hasHistory: hasHistory,
		};

	const absoluteURL = new URL(resolvedUrl, `https://anything.com`),
		pathSegments = absoluteURL.pathname.split("/");

	// All 'product' URLs follow a format like "/indicators/ind1-some-title/anything/here"
	// So by replacing the slug (2nd) segment we can support redirects to pages at any level
	// For example from "/indicators/ind1-wrong-title/anything/here" to /indicators/ind1-correct-title/anything/here
	pathSegments[2] = expectedSlug;

	return {
		redirect: {
			// Retain the 'search' (querystring) part of the URL to retain things like utm params
			destination: pathSegments.join("/") + absoluteURL.search,
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
