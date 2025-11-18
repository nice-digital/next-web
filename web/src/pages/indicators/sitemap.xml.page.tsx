import { type GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import {
	Document,
	initialise as initSearchClient,
	search,
	SearchResultsSuccess,
} from "@nice-digital/search-client";

import { publicRuntimeConfig } from "@/config";
import {
	type ProjectDetail,
	ProjectType,
	ProjectGroup,
} from "@/feeds/inDev/inDev";
import {
	type ProductLite,
	ProductTypeAcronym,
	ProductGroup,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { getProductPath, getProjectPath } from "@/utils/url";

const toSitemapURL = (document: Document): ISitemapField => {
	const isProduct = document.guidanceStatus[0] === "Published";

	let productOrProject, path;

	if (isProduct) {
		productOrProject = {
			productGroup: ProductGroup.Other,
			id: document.guidanceRef,
			productType: ProductTypeAcronym.IND,
			title: document.title,
		} as ProductLite;

		path = getProductPath(productOrProject);
	} else {
		productOrProject = {
			projectGroup: ProjectGroup.Other,
			status: document.guidanceStatus,
			reference: document.guidanceRef,
			projectType: ProjectType.IND,
		} as unknown as ProjectDetail;

		path = getProjectPath(productOrProject);
	}

	return {
		loc: publicRuntimeConfig.baseURL + path,
		lastmod: document.lastUpdated ?? undefined,
	};
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	initSearchClient({
		baseURL: publicRuntimeConfig.search.baseURL,
		index: "indicators",
	});

	const startTime = process.hrtime.bigint(),
		endTime = process.hrtime.bigint();

	const results = await search(context.resolvedUrl, {
		defaultPageSize: 9999,
		usePrettyUrls: true,
		// add the following for published only - orModifierPreFilter: { gst: ["Published"] },
	});

	if (results.failed) {
		logger.error(
			`Error loading guidance from search on page ${context.resolvedUrl}: ${results.errorMessage}`,
			results.debug?.rawResponse
		);
		context.res.statusCode = 500;
	}

	const { documents } = results as SearchResultsSuccess;

	const sitemapURLs = documents.map(toSitemapURL);

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
