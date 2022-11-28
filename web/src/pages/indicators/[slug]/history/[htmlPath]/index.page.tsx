import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { validateRouteParams } from "@/utils/product";

export type HistoryHTMLPageProps = {
	productPath: string;
	product: Pick<
		ProductDetail,
		| "id"
		| "title"
		| "productTypeName"
		| "publishedDate"
		| "lastMajorModificationDate"
	>;
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
	resource: {
		resourceFileHTML: string;
		title: string;
	};
	lastUpdated: string;
};

export default function HistoryHTMLPage({
	productPath,
	product,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
	resource,
	lastUpdated,
}: HistoryHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={
					product.title + " | History | Indicators | Standards and Indicators"
				}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={`/indicators/${product.id}`}>{product.id}</Breadcrumb>
				<Breadcrumb to={`/indicators/${product.id}/history`}>
					History
				</Breadcrumb>
				<Breadcrumb>{resource.title}</Breadcrumb>
			</Breadcrumbs>
			<ProductPageHeading product={product} />
			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				hasEvidenceResources={hasEvidenceResources}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasHistory={hasHistory}
			/>
			<div
				dangerouslySetInnerHTML={{ __html: resource.resourceFileHTML }}
			></div>
			{lastUpdated ? (
				<p>
					This page was last updated on{" "}
					<time dateTime={stripTime(lastUpdated)}>
						{formatDateStr(lastUpdated)}
					</time>
				</p>
			) : null}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryHTMLPageProps,
	{ slug: string; htmlPath: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		hasEvidenceResources,
		hasInfoForPublicResources,
		hasToolsAndResources,
		hasHistory,
		historyPanels,
	} = result;

	const resource = historyPanels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find(
			(resource) =>
				resource.embedded?.niceIndevFile.resourceTitleId === params?.htmlPath &&
				resource.showInDocList
		);

	if (!resource) return { notFound: true };

	const resourceFilePath = resource.embedded.niceIndevFile.links.self[0].href;

	const resourceFileHTML = await getResourceFileHTML(resourceFilePath);

	if (resourceFileHTML == null) return { notFound: true };

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
			product: {
				id: product.id,
				title: product.title,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				lastMajorModificationDate: product.lastMajorModificationDate,
			},
			resource: { resourceFileHTML, title: resource.title },
			lastUpdated: resource.publishedDate,
		},
	};
};
