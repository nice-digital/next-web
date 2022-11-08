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
	ChapterHTMLContent,
	HTMLChapterSectionInfo,
} from "@/feeds/publications/types";
import { getProductPath, getProductSlug } from "@/utils/url";

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
		...part.embedded.htmlContent.embedded.htmlChapterContentInfo
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
	| { product: ProductDetail };

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	resolvedUrl: string
): Promise<ValidateRouteParamsResult> => {
	if (!params || !params.slug) return { notFound: true };

	const productId = params.slug.split("-")[0],
		product = await getProductDetail(productId);

	if (isErrorResponse(product)) return { notFound: true };

	const expectedSlug = getProductSlug(product);

	if (params.slug === expectedSlug)
		return {
			product,
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
