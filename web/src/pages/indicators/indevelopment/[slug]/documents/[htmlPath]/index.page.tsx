import { type GetServerSideProps } from "next/types";
import React from "react";

import { validateRouteParams } from "@/utils/project";

export type DocumentHTMLPageProps = {
	someProp: string;
};

export default function HistoryHTMLPage({
	someProp,
}: DocumentHTMLPageProps): JSX.Element {
	return (
		<>
			<p>html page content here</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentHTMLPageProps,
	{ slug: string; htmlPath: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const someProp = "TODO";

	return {
		props: {
			someProp,
		},
	};
};
