import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import {
	OnThisPage,
	OnThisPageSection,
} from "@/components/OnThisPage/OnThisPage";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { getResourceFileHTML, ProjectDetail } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

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
	project: Pick<ProjectDetail, "reference" | "title">;
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
	resourceFileHTML: string;
};

export default function HistoryHTMLPage({
	productPath,
	product,
	project,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
	resourceFileHTML,
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
				<Breadcrumb>{product.id}</Breadcrumb>
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
			<div dangerouslySetInnerHTML={{ __html: resourceFileHTML }}></div>
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
		project,
		product,
		productPath,
		hasEvidenceResources,
		hasInfoForPublicResources,
		hasToolsAndResources,
		hasHistory,
		historyPanels,
	} = result;

	if (!project) return { notFound: true };

	const resource = historyPanels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find(
			(resource) =>
				resource.embedded?.niceIndevFile.resourceTitleId === params?.htmlPath
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
			project: {
				reference: project.reference,
				title: project.title,
			},
			resourceFileHTML,
		},
	};
};
