import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { getResourceDetails } from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { validateRouteParams } from "@/utils/product";
import {
	getResourceGroups,
	type ResourceGroupViewModel,
	ResourceTypeSlug,
} from "@/utils/resource";

export type ToolsAndResourcesListPageProps = {
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export default function ToolsAndResourcesListPage({
	resourceGroups,
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}: ToolsAndResourcesListPageProps): JSX.Element {
	return (
		<>
			<NextSeo title={`Tools and resources | ${product.id} | Indicators`} />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
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

			<ResourceList title="Tools and resources" groups={resourceGroups} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	ToolsAndResourcesListPageProps,
	{ slug: string }
> = async ({ params, query, resolvedUrl }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		hasToolsAndResources,
		toolsAndResources,
		hasInfoForPublicResources,
		hasEvidenceResources,
		hasHistory,
	} = result;

	if (!toolsAndResources.length) {
		logger.info(`No tools and resources found for product ${product.id}`);
		return { notFound: true };
	}

	const fullResources = await getResourceDetails(toolsAndResources),
		resourceGroups = getResourceGroups(
			product.id,
			productPath,
			fullResources,
			ResourceTypeSlug.ToolsAndResources
		);

	if (resourceGroups.length === 0) {
		logger.info(`No tools and resource groups found for product ${product.id}`);
		return { notFound: true };
	}

	return {
		props: {
			resourceGroups,
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
