import { type Redirect } from "next";

import {
	getProductDetail,
	isErrorResponse,
} from "@/feeds/publications/publications";
import {
	type ProductDetail,
	ProductGroup,
	type ChapterHeading,
	UploadAndConvertContentPart,
	HTMLChapterContentInfo,
	ProductTypeAcronym,
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

	const productPath = getProductPath({
		...product,
		productGroup,
	});

	const shouldIncludeChapter = ({ title }: HTMLChapterContentInfo) =>
		title !== overviewTitle || !product.summary;

	return [
		...(product.summary
			? [
					{
						title: overviewTitle,
						url: productPath,
					},
			  ]
			: []),
		...arrayify(part.embedded.htmlContent.embedded?.htmlChapterContentInfo)
			.filter(shouldIncludeChapter)
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
			toolsAndResources: RelatedResource[];
			evidenceResources: RelatedResource[];
			infoForPublicResources: RelatedResource[];
	  };

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	resolvedUrl: string
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	const productId = params.slug.split("-")[0],
		product = await getProductDetail("ng100");

	if (isErrorResponse(product)) return { notFound: true };

	product.productType = ProductTypeAcronym.IND;

	const expectedSlug = getProductSlug(product);

	if (params.slug === expectedSlug)
		return {
			product,
			toolsAndResources: getPublishedToolsAndResources(product),
			evidenceResources: getPublishedEvidenceResources(product),
			infoForPublicResources: getPublishedIFPResources(product),
		};

	const absoluteURL = new URL(resolvedUrl, `https://anything.com`),
		pathParts = absoluteURL.pathname.split("/");

	pathParts[2] = expectedSlug;

	return {
		redirect: {
			destination: pathParts.join("/") + absoluteURL.search,
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
		product.embedded.relatedResourceList?.embedded.relatedResource
	).filter((resource) => resource.status === Status.Published);

export const getPublishedToolsAndResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter(
		getResourceExcludeFilter(
			ResourceGroupType.Evidence,
			ResourceGroupType.InformationForThePublic
		)
	);

export const getPublishedEvidenceResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter(
		getResourcesIncludeFilter(ResourceGroupType.Evidence)
	);

export const getPublishedIFPResources = (
	product: ProductDetail
): RelatedResource[] =>
	getPublishedRelatedResources(product).filter(
		getResourcesIncludeFilter(ResourceGroupType.InformationForThePublic)
	);

const getResourceExcludeFilter =
	(...resourceGroupTypes: ResourceGroupType[]) =>
	(resource: RelatedResource) =>
		!resourceGroupTypes.includes(
			resource.embedded.resourceGroupList.embedded.resourceGroup.name
		);

const getResourcesIncludeFilter =
	(...resourceGroupTypes: ResourceGroupType[]) =>
	(resource: RelatedResource) =>
		resourceGroupTypes.includes(
			resource.embedded.resourceGroupList.embedded.resourceGroup.name
		);
