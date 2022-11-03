import { type Redirect } from "next";

import {
	getProductDetail,
	isErrorResponse,
} from "@/feeds/publications/publications";
import {
	type ProductDetail,
	ProductGroup,
	type ProductChapter,
} from "@/feeds/publications/types";
import { getProductPath, getProductSlug } from "@/utils/index";

export const getChapterLinks = (product: ProductDetail): ProductChapter[] => {
	const { nicePublicationsUploadAndConvertContentPart: partOrParts } =
			product.embedded.nicePublicationsContentPartList.embedded,
		part = Array.isArray(partOrParts) ? partOrParts[0] : partOrParts,
		chapterContentInfos = part
			? part.embedded.nicePublicationsHtmlContent.embedded
					.nicePublicationsHtmlChapterContentInfo
			: [];

	const chapterLinks: ProductChapter[] = [];

	const productPath = getProductPath({
		...product,
		productGroup: ProductGroup.Other,
	});

	if (product.summary) {
		chapterLinks.push({
			title: "Overview",
			url: productPath,
		});
	}

	chapterContentInfos.forEach((chapter) => {
		if (product.summary && chapter.title == "Overview") {
			return;
		}
		return chapterLinks.push({
			title: chapter.title,
			url: `${productPath}/chapters/${chapter.chapterSlug}`,
		});
	});

	return chapterLinks;
};

export const validateRouteParams = async (
	params: { slug: string } | undefined,
	resolvedUrl: string
): Promise<
	{ notFound: true } | { redirect: Redirect } | { product: ProductDetail }
> => {
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
