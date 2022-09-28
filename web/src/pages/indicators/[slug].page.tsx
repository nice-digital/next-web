import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import React from "react";

import {
	getProductDetail,
	ProductDetail,
} from "@/feeds/publications/publications";

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
	if (!params) {
		return { notFound: true };
	}
	const { slug } = params;

	if (!slug || Array.isArray(slug)) {
		return { notFound: true };
	}

	const [id, ...rest] = slug.split("-");

	const product = await getProductDetail(id);

	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	if (product && product.Id) {
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
	} else {
		console.log(
			"there is a problem with product ",
			product.Message,
			product.StatusCode
		);
		return { notFound: true };
	}

	return { props: { slug, id, product } };
};
