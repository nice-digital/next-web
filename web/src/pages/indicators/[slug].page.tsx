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
	console.log({ product });
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

	console.log(id);

	const product = await getProductDetail(id);

	const title = rest.join("-");

	return { props: { slug, id, product } };
};
