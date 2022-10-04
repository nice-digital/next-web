import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import React from "react";

import {
	getProductDetail,
	isErrorResponse,
	ProductDetail,
} from "@/feeds/publications/publications";

export const slugifyFunction = slugify;

export type IndicatorsDetailsPageProps = {
	slug: string;
	id: string;
	product: ProductDetail;
};

export default function IndicatorsDetailsPage({
	id,
	product,
}: IndicatorsDetailsPageProps): JSX.Element {
	return (
		<>
			<p>
				Indicators details page id:{id} title:{product.Title}
			</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-")
	) {
		return { notFound: true };
	}

	const [id, ...rest] = params.slug.split("-");

	const product = await getProductDetail(id);

	if (
		isErrorResponse(product) ||
		product.Id.toLowerCase() !== id.toLowerCase()
	) {
		return { notFound: true };
	}

	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	//TODO consider early return when there is no product;

	const slugifiedProductTitle = slugify(product.Title);
	if (titleExtractedFromSlug !== slugifiedProductTitle) {
		const redirectUrl = "/indicators/" + id + "-" + slugifiedProductTitle;

		return {
			redirect: {
				destination: redirectUrl,
				permanent: true,
			},
		};
	}

	return { props: { slug: params.slug, id, product } };
};
