import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached, getResponseStream } from "../";

import {
	AreaOfInterest,
	AreasOfInterestList,
	ErrorResponse,
	FeedPath,
	ChapterHTMLContent,
	IndicatorSubType,
	IndicatorSubTypesList,
	ProductDetail,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypeList,
	ResourceDetail,
	RelatedResource,
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
				await getFeedBodyUnCached<ProductTypeList>(
					origin,
					FeedPath.ProductTypes,
					apiKey
				)
			).embedded.productTypeList.embedded.productType
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
				await getFeedBodyUnCached<AreasOfInterestList>(
					origin,
					FeedPath.AreasOfInterest,
					apiKey
				)
			).embedded.areaOfInterestTypeList.embedded.areaOfInterestType
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
				await getFeedBodyUnCached<IndicatorSubTypesList>(
					origin,
					FeedPath.IndicatorSubTypes,
					apiKey
				)
			).embedded.indicatorSubTypeList.embedded.indicatorSubType
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
 * Gets a product detail.
 *
 */
export const getProductDetail = async (
	productId: string
): Promise<ProductDetail | ErrorResponse> =>
	//TODO don't cache error response
	await getFeedBodyCached<ProductDetail | ErrorResponse>(
		cacheKeyPrefix,
		FeedPath.ProductDetail + productId,
		longTTL,
		async () =>
			await getFeedBodyUnCached<ProductDetail | ErrorResponse>(
				origin,
				FeedPath.ProductDetail + productId,
				apiKey
			)
	);

/**
 * Gets chapter HTML.
 *
 */
export const getChapterContent = async (
	chapterHref: string
): Promise<ChapterHTMLContent | ErrorResponse> => {
	return getFeedBodyUnCached<ChapterHTMLContent | ErrorResponse>(
		origin,
		chapterHref,
		apiKey
	);
};

/**
 * Fetches a full resource response from publications
 *
 * @param resource The related resource
 */
export const getResourceDetail = async (
	resource: RelatedResource
): Promise<ResourceDetail | ErrorResponse> => {
	return getFeedBodyUnCached<ResourceDetail | ErrorResponse>(
		origin,
		resource.links.relatedResourceUri[0].href,
		apiKey
	);
};

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
