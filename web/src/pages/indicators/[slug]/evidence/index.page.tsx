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
import { validateRouteParams } from "@/utils/product";
import {
	getResourceGroup,
	isEvidenceUpdate,
	isSupportingEvidence,
	type ResourceGroupViewModel,
	ResourceTypeSlug,
} from "@/utils/resource";

export type EvidenceResourcesListPageProps = {
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export default function EvidenceResourcesListPage({
	resourceGroups,
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}: EvidenceResourcesListPageProps): JSX.Element {
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

			<ResourceList title="Evidence" groups={resourceGroups} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	EvidenceResourcesListPageProps,
	{ slug: string }
> = async ({ params, query, resolvedUrl }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		hasToolsAndResources,
		evidenceResources,
		hasInfoForPublicResources,
		hasEvidenceResources,
		hasHistory,
	} = result;

	if (!evidenceResources.length) return { notFound: true };

	const fullResources = await getResourceDetails(evidenceResources),
		resourceGroups = [
			...(fullResources.some(isEvidenceUpdate)
				? [
						getResourceGroup(
							product.id,
							productPath,
							"Evidence updates",
							fullResources.filter(isEvidenceUpdate),
							ResourceTypeSlug.Evidence
						),
				  ]
				: []),
			...(fullResources.some(isSupportingEvidence)
				? [
						getResourceGroup(
							product.id,
							productPath,
							"Supporting evidence",
							fullResources.filter(isSupportingEvidence),
							ResourceTypeSlug.Evidence
						),
				  ]
				: []),
		];

	if (resourceGroups.length === 0) return { notFound: true };

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
