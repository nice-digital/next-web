import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import React from "react";

import {
	getAllProductTypes,
	getChapterContent,
	getProductDetail,
	HTMLChapterContent,
	isErrorResponse,
	ProductDetail,
	ProductType,
} from "@/feeds/publications/publications";

export const slugifyFunction = slugify;

export type IndicatorChapterPageProps = {
	slug: string;
	id: string;
	product: ProductDetail;
	productType: ProductType;
	chapterContent: HTMLChapterContent;
};

export default function IndicatorChapterPage({
	chapterContent,
}: IndicatorChapterPageProps): JSX.Element {
	return <>{chapterContent.content}</>;
}

export const getServerSideProps: GetServerSideProps<
	IndicatorChapterPageProps
> = async ({ params }) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-") ||
		!params.chapterSlug ||
		Array.isArray(params.chapterSlug)
	) {
		return { notFound: true };
	}

	const productTypes = await getAllProductTypes();
	const productType = productTypes.find((p) => p.identifierPrefix === "IND");

	if (!productType) {
		throw Error("Indicator product type could not be found");
	}

	const [id, ...rest] = params.slug.split("-");

	const product = await getProductDetail(id);

	if (
		isErrorResponse(product) ||
		product.id.toLowerCase() !== id.toLowerCase()
	) {
		return { notFound: true };
	}

	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	//TODO consider early return when there is no product;

	//TODO redirect to chapter slug
	const slugifiedProductTitle = slugify(product.title);
	if (titleExtractedFromSlug !== slugifiedProductTitle) {
		const redirectUrl = "/indicators/" + id + "-" + slugifiedProductTitle;

		return {
			redirect: {
				destination: redirectUrl,
				permanent: true,
			},
		};
	}

	const chapter =
		product.embedded.nicePublicationsContentPartList.embedded.nicePublicationsUploadAndConvertContentPart.embedded.nicePublicationsHtmlContent.embedded.nicePublicationsHtmlChapterContentInfo.find(
			(c) => c.chapterSlug === params.chapterSlug
		);

	// console.log({ chapter });
	// console.log(chapter && chapter._links);

	if (!chapter) {
		return { notFound: true };
	}

	const chapterContent = await getChapterContent(
		chapter?._links.self[0].href as string
	);

	if (isErrorResponse(chapterContent)) {
		return { notFound: true };
	}

	return {
		props: {
			slug: params.slug,
			id,
			product,
			productType,
			chapterContent,
		},
	};
};
