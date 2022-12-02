import { type GetServerSideProps } from "next";

import { ProductResourcesListPage } from "@/components/ProductResourcesListPage/ProductResourcesListPage";
import {
	getGetServerSidePropsFunc,
	type ProductResourcesListPageProps,
} from "@/components/ProductResourcesListPage/ProductResourcesListPage.getServerSideProps";
import { getResourceDetails } from "@/feeds/publications/publications";
import { getResourceGroups, ResourceTypeSlug } from "@/utils/resource";

const resourceTypeSlug = ResourceTypeSlug.ToolsAndResources,
	resourceTypeName = "Tools and resources";

export default ProductResourcesListPage;

export const getServerSideProps: GetServerSideProps<
	ProductResourcesListPageProps,
	{ slug: string; partSlug: string }
> = getGetServerSidePropsFunc({
	resourceTypeSlug,
	resourceTypeName,
	getResourceGroups: async ({ toolsAndResources, product, productPath }) => {
		if (!toolsAndResources.length) return [];

		const fullResources = await getResourceDetails(toolsAndResources);

		return getResourceGroups(
			product.id,
			productPath,
			fullResources,
			resourceTypeSlug
		);
	},
});
