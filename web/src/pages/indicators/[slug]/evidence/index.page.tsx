import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import {
	getResourceDetail,
	isErrorResponse,
} from "@/feeds/publications/publications";
import { ProductGroup, ResourceDetail } from "@/feeds/publications/types";
import { validateRouteParams } from "@/utils/product";
import {
	getResourceSubGroups,
	isEvidenceUpdate,
	isSupportingEvidence,
	ResourceGroupViewModel,
} from "@/utils/resource";
import { getProductPath } from "@/utils/url";

export type IndicatorEvidencePageProps = {
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export default function ({
	resourceGroups,
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}: IndicatorEvidencePageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Evidence | ${product.id} | Indicators | Standards and Indicators`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={productPath} elementType={Link}>
					{product.id}
				</Breadcrumb>
				<Breadcrumb>Evidence</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasEvidenceResources={hasEvidenceResources}
				hasHistory={hasHistory}
			/>

			<h2>Evidence</h2>

			<ResourceList groups={resourceGroups} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorEvidencePageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const {
			product,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			evidenceResources,
			hasHistory,
		} = result,
		productPath = getProductPath({
			...product,
			productGroup: ProductGroup.Other,
		}),
		resources = await Promise.all(evidenceResources.map(getResourceDetail));

	if (resources.filter(isErrorResponse).length > 0)
		throw Error(
			`Failed to retrieve some resources from product ${product.id} at ${resolvedUrl}`
		);

	const resourceGroups: ResourceGroupViewModel[] = [
		{
			title: "Evidence updates",
			subGroups: getResourceSubGroups(
				(resources as ResourceDetail[]).filter(isEvidenceUpdate)
			),
		},
		{
			title: "Supporting evidence",
			subGroups: getResourceSubGroups(
				(resources as ResourceDetail[]).filter(isSupportingEvidence)
			),
		},
	].filter((group) =>
		group.subGroups.some((subGroup) => subGroup.resourceLinks.length > 0)
	);

	return {
		props: {
			resourceGroups,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
			productPath,
			product: {
				id: product.id,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				title: product.title,
			},
		},
	};
};
