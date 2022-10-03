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
	// console.log({ product });
	return (
		<>
			<p>
				Indicators details page id:{id} title:{product.Title}
			</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	if (!params || !params.slug || Array.isArray(params.slug)) {
		return { notFound: true };
	}

	const [id, ...rest] = params.slug.split("-");

	const product = await getProductDetail(id);

	if (isErrorResponse(product)) {
		console.log(
			"there is a problem with product ",
			product.Message,
			product.StatusCode
		);
		return { notFound: true };
	}
	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	//TODO consider early return when there is no product;

	const slugifiedProductTitle = slugify(product.Title);
	if (titleExtractedFromSlug !== slugifiedProductTitle) {
		const redirectUrl = id + "-" + slugifiedProductTitle;

		return {
			redirect: {
				destination: redirectUrl,
				permanent: false,
			},
		};
	}

	return { props: { slug: params.slug, id, product } };
};
