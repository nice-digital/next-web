import { type GetServerSideProps } from "next/types";
import React from "react";

import { getProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type HistoryPageProps = {
	inDevReference: string;
};

export default function HistoryPage({
	inDevReference,
}: HistoryPageProps): JSX.Element {
	return (
		<>
			<p>Indicators history tab {inDevReference}</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const project = await getProjectDetail("GID-NG10014");

	if (isErrorResponse(project)) throw new Error("project not found");

	console.log(project);

	return {
		props: {
			inDevReference: result.product.inDevReference,
		},
	};
};
