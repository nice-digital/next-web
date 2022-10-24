import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached } from "../";

import {
	AreaOfInterest,
	AreasOfInterestList,
	ErrorResponse,
	FeedPath,
	HTMLChapterContent,
	ProductDetail,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypeList,
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
			).embedded.nicePublicationsProductListLite.embedded.nicePublicationsProductLite.map(
				(product) => {
					// Discard unneeded properties on products to make what we're storing in cache a lot smaller.
					// This means we're essentially storing a ProductLite in cache rather than a ProductLiteRaw.
					// In perf tests this saved ~30% off the cache load time from the file system (once you factor in deserialization, file access times etc).
					delete (product as Partial<typeof product>).eTag;
					delete (product as Partial<typeof product>).links;
					return product;
				}
			)
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
			).embedded.nicePublicationsProductTypeList.embedded
				.nicePublicationsProductType
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
			).embedded.nicePublicationsAreaOfInterestTypeList.embedded
				.nicePublicationsAreaOfInterestType
	);

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
): Promise<HTMLChapterContent | ErrorResponse> => {
	return getFeedBodyUnCached<HTMLChapterContent | ErrorResponse>(
		origin,
		chapterHref,
		apiKey
	);
};

export function isErrorResponse<TValidResponse>(
	response: TValidResponse | ErrorResponse
): response is ErrorResponse {
	return (response as ErrorResponse).StatusCode !== undefined;
}
