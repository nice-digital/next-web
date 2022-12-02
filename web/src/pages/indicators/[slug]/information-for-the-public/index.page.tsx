import { type GetServerSideProps } from "next";

import { ProductResourcesListPage } from "@/components/ProductResourcesListPage/ProductResourcesListPage";
import {
	getGetServerSidePropsFunc,
	type ProductResourcesListPageProps,
} from "@/components/ProductResourcesListPage/ProductResourcesListPage.getServerSideProps";
import { getResourceDetails } from "@/feeds/publications/publications";
import { getResourceGroups, ResourceTypeSlug } from "@/utils/resource";

const resourceTypeSlug = ResourceTypeSlug.InformationForThePublic,
	resourceTypeName = "Information for the public";

export default ProductResourcesListPage;

export const getServerSideProps: GetServerSideProps<
	ProductResourcesListPageProps,
	{ slug: string; partSlug: string }
> = getGetServerSidePropsFunc({
	resourceTypeSlug,
	resourceTypeName,
	getResourceGroups: async ({
		infoForPublicResources,
		product,
		productPath,
	}) => {
		if (!infoForPublicResources.length) return [];

		const fullResources = await getResourceDetails(infoForPublicResources);

		return getResourceGroups(
			product.id,
			productPath,
			fullResources,
			resourceTypeSlug
		);
	},
});
