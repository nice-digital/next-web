import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import React from "react";

import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import {
	getAllProductTypes,
	getProductDetail,
	isErrorResponse,
	ProductDetail,
	ProductType,
} from "@/feeds/publications/publications";
import { formatDateStr } from "@/utils";

export const slugifyFunction = slugify;

export type IndicatorsDetailsPageProps = {
	slug: string;
	id: string;
	product: ProductDetail;
	productType: ProductType;
};

export default function IndicatorsDetailsPage({
	id,
	product,
	productType,
	slug,
}: IndicatorsDetailsPageProps): JSX.Element {
	return (
		<>
			<h1>{product.title}</h1>
			<ul>
				<li>{productType.name}</li>
				<li>{id} </li>
				{product.publishedDate ? (
					<li>
						published: <time>{formatDateStr(product.publishedDate)}</time>
					</li>
				) : null}

				{product.lastUpdatedDate ? (
					<li>
						last updated: <time>{formatDateStr(product.lastUpdatedDate)}</time>
					</li>
				) : null}
			</ul>
			{product.chapterHeadings ? (
				<PublicationsChapterMenu
					chapters={product.chapterHeadings}
					productType={productType.identifierPrefix}
					slug={slug}
				/>
			) : null}

			{product.summary ? <p>{product.summary}</p> : <p>summary goes here</p>}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorsDetailsPageProps
> = async ({ params }) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-")
	) {
		return { notFound: true };
	}

	// const lookupProductTypeById = (id: string): string => {
	// 	const productTypes = getAllProductTypes();
	// 	console.log({ productTypes });
	// 	return "product type";
	// };

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

	return {
		props: {
			slug: params.slug,
			id,
			product,
			productType,
		},
	};
};
