import { type GetServerSideProps } from "next";

import { ProductResourcesListPage } from "@/components/ProductResourcesListPage/ProductResourcesListPage";
import {
	getGetServerSidePropsFunc,
	type ProductResourcesListPageProps,
} from "@/components/ProductResourcesListPage/ProductResourcesListPage.getServerSideProps";
import { ResourceTypeSlug } from "@/utils/resource";

export default ProductResourcesListPage;

export const getServerSideProps: GetServerSideProps<
	ProductResourcesListPageProps,
	{ slug: string; partSlug: string }
> = getGetServerSidePropsFunc(ResourceTypeSlug.Evidence);
