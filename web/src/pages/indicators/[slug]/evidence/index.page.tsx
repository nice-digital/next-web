import { type GetServerSideProps } from "next";

import { ProductResourcesListPage } from "@/components/ProductResourcesListPage/ProductResourcesListPage";
import {
	getGetServerSidePropsFunc,
	type ProductResourcesListPageProps,
} from "@/components/ProductResourcesListPage/ProductResourcesListPage.getServerSideProps";
import { getResourceDetails } from "@/feeds/publications/publications";
import {
	getResourceGroup,
	isEvidenceUpdate,
	isSupportingEvidence,
	ResourceTypeSlug,
} from "@/utils/resource";

const resourceTypeSlug = ResourceTypeSlug.Evidence,
	resourceTypeName = "Evidence";

export default ProductResourcesListPage;

export const getServerSideProps: GetServerSideProps<
	ProductResourcesListPageProps,
	{ slug: string; partSlug: string }
> = getGetServerSidePropsFunc({
	resourceTypeSlug,
	resourceTypeName,
	getResourceGroups: async ({ evidenceResources, product, productPath }) => {
		if (!evidenceResources.length) return [];

		const fullResources = await getResourceDetails(evidenceResources);

		return [
			...(fullResources.some(isEvidenceUpdate)
				? [
						getResourceGroup(
							product.id,
							productPath,
							"Evidence updates",
							fullResources.filter(isEvidenceUpdate),
							resourceTypeSlug
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
							resourceTypeSlug
						),
				  ]
				: []),
		];
	},
});
