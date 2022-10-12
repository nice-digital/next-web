import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";

import {
	getAllProductTypes,
	getProductDetail,
	isErrorResponse,
	ProductChapter,
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

export type ChapterHeadingsProps = {
	chapters: ProductChapter[];
};

export function ChapterHeadingsList({
	chapters,
}: ChapterHeadingsProps): JSX.Element {
	return (
		<ul>
			<legend>Chapters</legend>
			{chapters.map((item, i) => {
				return (
					<li key={i}>
						<Link href={item.url}>
							<a>{item.title}</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

export default function IndicatorsDetailsPage({
	id,
	product,
	productType,
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
				<ChapterHeadingsList chapters={product.chapterHeadings} />
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
