import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached, getResponseStream } from "../";

import {
	AreaOfInterest,
	AreaOfInterestTypes,
	ErrorResponse,
	FeedPath,
	ChapterHTMLContent,
	IndicatorSubType,
	IndicatorSubTypes,
	ProductDetail,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypes,
	ResourceDetail,
	RelatedResourceList,
	IndicatorMappings,
	IndicatorMapping,
} from "./types";

export * from "./types";

const cacheKeyPrefix = "publications",
	{ defaultTTL, longTTL } = serverRuntimeConfig.cache,
	{ origin, apiKey } = serverRuntimeConfig.feeds.publications;

/**
 * Gets a list of products from the 'products lite' endpoint.
 */
export const getAllProducts = async (): Promise<ProductLite[]> =>
	await getFeedBodyCached<ProductLite[]>(
		cacheKeyPrefix,
		FeedPath.ProductsLite,
		defaultTTL,
		async () =>
			(
				await getFeedBodyUnCached<ProductListLite>(
					origin,
					FeedPath.ProductsLite,
					apiKey
				)
			).embedded.productListLite.embedded.productLite.map((product) => {
				// Discard unneeded properties on products to make what we're storing in cache a lot smaller.
				// This means we're essentially storing a ProductLite in cache rather than a ProductLiteRaw.
				// In perf tests this saved ~30% off the cache load time from the file system (once you factor in deserialization, file access times etc).
				delete (product as Partial<typeof product>).eTag;
				delete (product as Partial<typeof product>).links;
				return product;
			})
	);

/**
 * Gets _all_ product types.
 *
 * Note: there's no pre-filter so it includes both enabled _and_ disabled product types.
 */
export const getAllProductTypes = async (): Promise<ProductType[]> =>
	await getFeedBodyCached<ProductType[]>(
		cacheKeyPrefix,
		FeedPath.ProductTypes,
		longTTL,
		async () =>
			(
				await getFeedBodyUnCached<ProductTypes>(
					origin,
					FeedPath.ProductTypes,
					apiKey
				)
			).productTypes
	);

/**
 * Gets _all_ areas of interest e.g. Covid-19 and Antimicrbial prescribing.
 *
 * Note: there's no pre-filter so it includes both enabled _and_ disabled areas of interest.
 */
export const getAllAreasOfInterest = async (): Promise<AreaOfInterest[]> =>
	await getFeedBodyCached<AreaOfInterest[]>(
		cacheKeyPrefix,
		FeedPath.AreasOfInterest,
		longTTL,
		async () =>
			(
				await getFeedBodyUnCached<AreaOfInterestTypes>(
					origin,
					FeedPath.AreasOfInterest,
					apiKey
				)
			).areaOfInterestTypes
	);

/**
 * Gets _all_ indicator sub types e.g. Clinical commissioning group indicator.
 *
 * Note: there's no pre-filter so it includes both enabled _and_ disabled indicator sub types.
 */
export const getAllIndicatorSubTypes = async (): Promise<IndicatorSubType[]> =>
	await getFeedBodyCached<IndicatorSubType[]>(
		cacheKeyPrefix,
		FeedPath.IndicatorSubTypes,
		longTTL,
		async () =>
			(
				await getFeedBodyUnCached<IndicatorSubTypes>(
					origin,
					FeedPath.IndicatorSubTypes,
					apiKey
				)
			).indicatorSubTypes
	);

/**
 * Gets the indicator sub type object from the given identifier prefix
 *
 * @param identifierPrefix The identifier prefix of the indicator sub type to find e.g. CCG, GPIQ, GPINQ, NLQ etc
 * @returns The indicator sub type object if found, otherwise null
 */
export const getIndicatorSubType = async (
	identifierPrefix: string
): Promise<IndicatorSubType | null> =>
	(await getAllIndicatorSubTypes()).find(
		(subType) => subType.identifierPrefix === identifierPrefix
	) || null;

/**
 * Gets _all_ indicator mappings (redirects).
 */
export const getIndicatorMappings = async (): Promise<IndicatorMapping[]> =>
	await getFeedBodyCached<IndicatorMapping[]>(
		cacheKeyPrefix,
		FeedPath.IndicatorMappings,
		defaultTTL,
		async () =>
			(
				await getFeedBodyUnCached<IndicatorMappings>(
					origin,
					FeedPath.IndicatorMappings,
					apiKey
				)
			).mappings
	);

/**
 * Gets a full product detail response from publications from the given product id.
 *
 * @returns The full product details, or `null` if the product can't be found
 */
export const getProductDetail = async (
	productId: string
): Promise<ProductDetail | null> =>
	await getFeedBodyCached<ProductDetail | null>(
		cacheKeyPrefix,
		FeedPath.ProductDetail + productId,
		longTTL,
		async () => {
			const response = await getFeedBodyUnCached<ProductDetail | ErrorResponse>(
				origin,
				FeedPath.ProductDetail + productId,
				apiKey
			);

			return isSuccessResponse(response) ? response : null;
		}
	);

/**
 * Gets chapter HTML.
 *
 */
export const getChapterContent = async (
	chapterHref: string
): Promise<ChapterHTMLContent | null> => {
	return getFeedBodyCached<ChapterHTMLContent | null>(
		cacheKeyPrefix,
		chapterHref,
		longTTL,
		async () => {
			const response = await getFeedBodyUnCached<
				ChapterHTMLContent | ErrorResponse
			>(origin, chapterHref, apiKey);

			return isSuccessResponse(response) ? response : null;
		}
	);
};

/**
 * Fetches a full resource response from publications.
 *
 * Returns null if the resource can't be found.
 *
 * @param resource The related resource, or null if the resource can't be found
 */
export const getResourceDetail = async (
	resource: RelatedResourceList
): Promise<ResourceDetail | null> => {
	const { url } = resource;

	return getFeedBodyCached<ResourceDetail | null>(
		cacheKeyPrefix,
		url,
		longTTL,
		async () => {
			const response = await getFeedBodyUnCached<
				ResourceDetail | ErrorResponse
			>(origin, url, apiKey);

			return isSuccessResponse(response) ? response : null;
		}
	);
};

/**
 * Fetches full resources responses from publications for each of the given resources.
 *
 * It will throw an error if any of the resources can't be found
 */
export const getResourceDetails = async (
	resources: RelatedResourceList[]
): Promise<ResourceDetail[]> => {
	const fullResources = await Promise.all(
		resources.map(
			(relatedResource) =>
				new Promise<{
					relatedResource: RelatedResourceList;
					resourceDetail: ResourceDetail | null;
				}>((resolve) => {
					getResourceDetail(relatedResource).then((resourceDetail) => {
						resolve({
							relatedResource,
							resourceDetail,
						});
					});
				})
		)
	);

	// We can't 100% guarantee all related resources always still exist so handle if some can't be found
	const failedResources = fullResources
		.filter((r) => r.resourceDetail === null)
		.map((r) => r.relatedResource);

	if (failedResources.length)
		throw Error(
			`Could not load resources ${failedResources.map((r) => r.uid)}`
		);

	return fullResources
		.map((r) => r.resourceDetail)
		.filter((r): r is ResourceDetail => r !== null);
};

export const getImage = async (url: string): Promise<Buffer> =>
	await getFeedBodyCached<Buffer>(cacheKeyPrefix, url, longTTL, async () => {
		// Construct the full URL and headers for the request
		const logourl = origin + url;

		const response = await fetch(logourl, {
			method: "GET",
			headers: {
				"Api-Key": apiKey,
				Accept: "application/json",
			},
		});

		// Check if the response is OK
		if (!response.ok) {
			throw new Error(
				`Failed to fetch image from ${url}: ${response.statusText}`
			);
		}

		// Convert the response stream to a Blob
		const blob = await response.blob();

		let buffer = Buffer.from(await blob.arrayBuffer());

		return buffer;
	});

/**
 * Gets a stream of a file from publications.
 *
 * @param filePath The relative path of the endpoint that serves file content, e.g. `/feeds/downloads/737585a0-dad7-4a37-875b-b30b09c3fdc3`
 * @returns A readable stream of the file contents
 */
export const getFileStream = async (
	filePath: string
): Promise<ReturnType<typeof getResponseStream>> =>
	getResponseStream(origin, filePath, apiKey);

/**
 * A user-defined type guard for checking whether a given response is an error or not
 *
 * @param response The response
 * @returns True if this is an error response otherwise false
 */
export function isErrorResponse<TValidResponse>(
	response: TValidResponse | ErrorResponse
): response is ErrorResponse {
	return (response as ErrorResponse).statusCode !== undefined;
}

/**
 * A user-defined type guard for checking whether a given response is not an error.
 * The opposite of `isErrorResponse`
 *
 * @param response The response
 * @returns True if this is an error response otherwise false
 */
export function isSuccessResponse<TValidResponse>(
	response: TValidResponse | ErrorResponse
): response is TValidResponse {
	return (response as ErrorResponse).statusCode === undefined;
}
