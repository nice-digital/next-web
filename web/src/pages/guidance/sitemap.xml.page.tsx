import { type GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import {
	Document,
	initialise as initSearchClient,
	search,
	SearchResultsSuccess,
} from "@nice-digital/search-client";

import { publicRuntimeConfig } from "@/config";
import { type ProjectDetail } from "@/feeds/inDev/inDev";
import {
	type ProductLite,
	ProductGroup,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { getProductPath, getProjectPath } from "@/utils/url";

const toSitemapURL = (document: Document): ISitemapField => {
	const isProduct = document.guidanceStatus[0] === "Published";
	const productOrProjectType = document.guidanceRef
		? document.guidanceRef.replace(/[0-9]/g, "")
		: null;
	const groupFromSearchFeed = document.niceDocType[0];

	let productOrProject, path, productOrProjectGroup;

	// convert niceDocType from search api feed to ProductGroup enum string
	// nb. couldn't see 'Corporate' or 'Guideline' in live data
	switch (groupFromSearchFeed) {
		case "Guidance":
			productOrProjectGroup = ProductGroup.Guidance;
			break;
		case "NICE advice":
			productOrProjectGroup = ProductGroup.Advice;
			break;
		case "Quality standard":
			productOrProjectGroup = ProductGroup.Standard;
			break;
		case "Corporate":
			productOrProjectGroup = ProductGroup.Corporate;
			break;
		case "Guideline":
			productOrProjectGroup = ProductGroup.Guideline;
			break;
		default:
			throw `Unsupported product group ${
				document.niceDocType[0]
			} ${JSON.stringify(document)}`;
	}

	if (isProduct) {
		productOrProject = {
			productGroup: productOrProjectGroup,
			id: document.guidanceRef,
			productType: productOrProjectType,
			title: document.title,
		} as ProductLite;

		path = getProductPath(productOrProject);
	} else {
		productOrProject = {
			projectGroup: productOrProjectGroup,
			status: document.guidanceStatus,
			reference: document.guidanceRef,
			projectType: productOrProjectType,
		} as unknown as ProjectDetail;

		if (productOrProject.reference) {
			path = getProjectPath(productOrProject);
		} else {
			path = document.pathAndQuery;
		}
	}

	return {
		loc: publicRuntimeConfig.baseURL + path,
		lastmod: document.lastUpdated ?? undefined,
	};
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	initSearchClient({
		baseURL: publicRuntimeConfig.search.baseURL,
		index: "guidance",
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
