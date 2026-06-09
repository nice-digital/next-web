import { type GetServerSideProps } from "next";

import { ProductResourcePage } from "@/components/ProductResourcePage/ProductResourcePage";
import {
	type ProductResourcePageProps,
	getGetServerSidePropsFunc,
} from "@/components/ProductResourcePage/ProductResourcePage.getServerSideProps";
import { ResourceTypeSlug } from "@/utils/resource";

export default ProductResourcePage;

export const getServerSideProps: GetServerSideProps<
	ProductResourcePageProps,
	{ slug: string; partSlug: string }
> = getGetServerSidePropsFunc(ResourceTypeSlug.ToolsAndResources);
