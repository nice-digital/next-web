import parse from "html-react-parser";
import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Alert } from "@nice-digital/nds-alert";

import { GuidanceBreadcrumb } from "@/components/GuidanceBreadcrumb/GuidanceBreadcrumb";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { getResourceDetails } from "@/feeds/publications/publications";
import { ProductDetail, ProductTypeAcronym } from "@/feeds/publications/types";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";
import {
	redirectWithdrawnProducts,
	validateRouteParams,
} from "@/utils/product";
import {
	getResourceGroup,
	isEvidenceUpdate,
	isSupportingEvidence,
	ResourceTypeSlug,
	type ResourceGroupViewModel,
} from "@/utils/resource";

export type EvidenceResourcesListPageProps = {
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"] &
		Partial<Pick<ProductDetail, "productType" | "alert">>;
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	taxonomyBreadcrumb: TaxonomyBreadcrumb[];
};

export default function EvidenceResourcesListPage({
	resourceGroups,
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
	taxonomyBreadcrumb,
}: EvidenceResourcesListPageProps): JSX.Element {
	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";

	return (
		<>
			<NextSeo title={`Evidence | ${product.id} | ${label}`} />

			<GuidanceBreadcrumb
				append={[{ title: "Evidence" }]}
				id={product.id}
				productPath={productPath}
				status="terminated"
				taxonomy={taxonomyBreadcrumb}
				type={type}
			/>

			<ProductPageHeading product={product} />

			{product.alert ? <Alert type="info">{parse(product.alert)}</Alert> : null}

			<ProductHorizontalNav
				productTypeName={isIndicator ? "Indicator" : "Guidance"}
				productPath={productPath}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasEvidenceResources={hasEvidenceResources}
				hasHistory={hasHistory}
			/>

			<ResourceList
				title="Evidence"
				lead="Documents containing the evidence that was used to develop the recommendations."
				groups={resourceGroups}
			/>
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
		taxonomyBreadcrumb,
	} = result;

	const isWithdrawn = redirectWithdrawnProducts(product, productPath);

	if (isWithdrawn) {
		return isWithdrawn;
	}

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
				alert: product.alert,
				id: product.id,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				title: product.title,
				terminatedDate: product.terminatedDate,
			},
			taxonomyBreadcrumb,
		},
	};
};
