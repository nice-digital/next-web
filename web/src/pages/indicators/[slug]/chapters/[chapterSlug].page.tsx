import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import React from "react";

import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
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
	return (
		<>
			<PublicationsChapterMenu
				chapters={[
					{
						title: "some chapter",
						url: "/indicators/ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded/indicator-nm181",
					},
					{ title: "some other chapter", url: "/elsewhere" },
				]}
				productType="IND"
				slug="ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded"
			/>
			<span dangerouslySetInnerHTML={{ __html: chapterContent.content }} />
		</>
	);
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

	if (!chapter) {
		return { notFound: true };
	}

	const chapterContent = await getChapterContent(
		chapter?.links.self[0].href as string
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
