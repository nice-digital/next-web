import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import { publicRuntimeConfig } from "@/config";
import {
	getAllProducts,
	type ProductLite,
	ProductStatus,
	ProductTypeAcronym,
} from "@/feeds/publications/publications";
import { getProductPath } from "@/utils/index";

const isPublishedIndicator = ({ productStatus, productType }: ProductLite) =>
	productStatus === ProductStatus.Published &&
	productType === ProductTypeAcronym.IND;

const toSitemapURL = (product: ProductLite): ISitemapField => ({
	loc: publicRuntimeConfig.baseURL + getProductPath(product),
	lastmod: product.lastModified,
});

export const getServerSideProps: GetServerSideProps = async (context) => {
	const startTime = process.hrtime.bigint(),
		sitemapURLs = (await getAllProducts())
			.filter(isPublishedIndicator)
			.map(toSitemapURL),
		endTime = process.hrtime.bigint();

	context.res.setHeader(
		"Server-Timing",
		`api;dur=${Math.round(Number(endTime - startTime) / 1000000)}`
	);

	return getServerSideSitemap(context, sitemapURLs);
};

export default function Sitemap(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done by next-sitemap to generate XML which is written to to `context.res` under the hood
}
