import { GetServerSideProps } from "next";

import { type ProductPageHeadingProps } from "@/components/ProductPageHeading/ProductPageHeading";
import { getResourceDetails } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";
import {
	getResourceGroups,
	ResourceTypeSlug,
	type ResourceGroupViewModel,
} from "@/utils/resource";

export type ProductResourcesListPageProps = {
	resourceTypeSlug: ResourceTypeSlug;
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export const getGetServerSidePropsFunc =
	(
		resourceTypeSlug: ResourceTypeSlug
	): GetServerSideProps<
		ProductResourcesListPageProps,
		{ slug: string; partSlug: string }
	> =>
	async ({ params, resolvedUrl, query }) => {
		const result = await validateRouteParams({ params, resolvedUrl, query });

		if ("notFound" in result || "redirect" in result) return result;

		const {
			product,
			productPath,
			hasToolsAndResources,
			toolsAndResources,
			hasInfoForPublicResources,
			infoForPublicResources,
			hasEvidenceResources,
			evidenceResources,
			hasHistory,
		} = result;

		const resources =
			resourceTypeSlug === "resources"
				? toolsAndResources
				: resourceTypeSlug === "evidence"
				? evidenceResources
				: infoForPublicResources;

		if (resources.length === 0) return { notFound: true };

		return {
			props: {
				resourceTypeSlug,
				resourceGroups: getResourceGroups(
					product.id,
					productPath,
					await getResourceDetails(resources),
					resourceTypeSlug
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
