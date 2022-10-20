import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import { publicRuntimeConfig } from "@/config";
import {
	getAllProducts,
	type ProductLite,
	ProductStatus,
	ProductTypeAcronym,
} from "@/feeds/publications/publications";
import { getProductPath } from "@/utils/index";

const isPublishedIndicator = (product: ProductLite) =>
	product.productStatus === ProductStatus.Published &&
	product.productType === ProductTypeAcronym.IND;

const toSitemapURL = (product: ProductLite) => ({
	loc: publicRuntimeConfig.baseURL + getProductPath(product),
	lastmod: product.lastModified,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
	const sitemapURLs = (await getAllProducts())
		.filter(isPublishedIndicator)
		.map(toSitemapURL);

	return getServerSideSitemap(context, sitemapURLs);
};

export default function Sitemap(): void {
	// Default export to prevent next.js errors
}
