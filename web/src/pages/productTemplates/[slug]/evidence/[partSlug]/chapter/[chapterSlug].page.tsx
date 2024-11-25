import { type GetServerSideProps } from "next";

import { ProductResourceChapterPage } from "@/components/ProductResourceChapterPage/ProductResourceChapterPage";
import {
	getGetServerSidePropsFunc,
	type ProductResourceChapterPageProps,
} from "@/components/ProductResourceChapterPage/ProductResourceChapterPage.getServerSideProps";
import { ResourceTypeSlug } from "@/utils/resource";

export default ProductResourceChapterPage;

export const getServerSideProps: GetServerSideProps<
	ProductResourceChapterPageProps,
	{ slug: string; partSlug: string; chapterSlug: string }
> = getGetServerSidePropsFunc(ResourceTypeSlug.Evidence, "Evidence");
