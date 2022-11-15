import { type GetServerSideProps } from "next/types";
import React from "react";

import { validateRouteParams } from "@/utils/product";

export type HistoryPageProps = {
	id: string;
};

export default function HistoryPage({ id }: HistoryPageProps): JSX.Element {
	return (
		<>
			<p>Indicators history tab {id}</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	console.log(params);
	console.log(resolvedUrl);

	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const inDevReference = result.product.inDevReference;

	const id = inDevReference;

	return {
		props: {
			id,
		},
	};
};
