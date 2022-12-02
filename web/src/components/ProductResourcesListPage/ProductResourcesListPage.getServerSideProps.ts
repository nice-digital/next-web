import { GetServerSideProps } from "next";

import { type ProductPageHeadingProps } from "@/components/ProductPageHeading/ProductPageHeading";
import {
	validateRouteParams,
	ValidateRouteParamsSuccess,
} from "@/utils/product";
import {
	ResourceTypeSlug,
	type ResourceGroupViewModel,
} from "@/utils/resource";

export type ProductResourcesListPageProps = {
	resourceTypeSlug: ResourceTypeSlug;
	resourceTypeName: string;
	resourceGroups: ResourceGroupViewModel[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export type GetGetServerSidePropsContext = {
	resourceTypeSlug: ResourceTypeSlug;
	resourceTypeName: string;
	getResourceGroups: (
		result: ValidateRouteParamsSuccess
	) => Promise<ResourceGroupViewModel[]>;
};

export const getGetServerSidePropsFunc =
	({
		resourceTypeSlug,
		resourceTypeName,
		getResourceGroups,
	}: GetGetServerSidePropsContext): GetServerSideProps<
		ProductResourcesListPageProps,
		{ slug: string; partSlug: string }
	> =>
	async ({ params, resolvedUrl, query }) => {
		const result = await validateRouteParams({ params, resolvedUrl, query });

		if ("notFound" in result || "redirect" in result) return result;

		const resourceGroups = await getResourceGroups(result);

		if (resourceGroups.length === 0) return { notFound: true };

		const {
			product,
			productPath,
			hasToolsAndResources,
			hasInfoForPublicResources,
			hasEvidenceResources,
			hasHistory,
		} = result;

		return {
			props: {
				resourceTypeSlug,
				resourceTypeName,
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
