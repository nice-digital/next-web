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
	getResourceDetails,
	isErrorResponse,
	isSuccessResponse,
} from "@/feeds/publications/publications";
import { ProductGroup } from "@/feeds/publications/types";
import {
	getPublishedToolsAndResources,
	validateRouteParams,
} from "@/utils/product";
import { getResourceGroups, ResourceGroupViewModel } from "@/utils/resource";
import { getProductPath } from "@/utils/url";

export type IndicatorToolsAndResourcesPageProps = {
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
}: IndicatorToolsAndResourcesPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Tools and resources | ${product.id} | Indicators | Standards and Indicators`}
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
				<Breadcrumb>Tools and resources</Breadcrumb>
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

			<h2>Tools and resources</h2>

			<ResourceList groups={resourceGroups} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorToolsAndResourcesPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	if (!result.hasToolsAndResources) return { notFound: true };

	const {
			product,
			hasToolsAndResources,
			toolsAndResources,
			hasInfoForPublicResources,
			hasEvidenceResources,
			hasHistory,
		} = result,
		productPath = getProductPath({
			...product,
			productGroup: ProductGroup.Other,
		});

	return {
		props: {
			resourceGroups: getResourceGroups(
				await getResourceDetails(toolsAndResources)
			),
			hasToolsAndResources,
			hasInfoForPublicResources,
			hasEvidenceResources,
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
