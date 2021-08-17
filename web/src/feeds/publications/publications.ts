import { serverRuntimeConfig } from "@/config";

import { getFeedBodyCached, getFeedBodyUnCached } from "../";

import {
	AreaOfInterest,
	AreasOfInterestList,
	FeedPath,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypeList,
} from "./types";

import type { Mutable } from "type-fest";

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
			)._embedded["nice.publications:product-list-lite"]._embedded[
				"nice.publications:product-lite"
			].map((product) => {
				// Discard unneeded properties on products to make what we're storing in cache a lot smaller.
				// This means we're essentially storing a ProductLite in cache rather than a ProductLiteRaw.
				// In perf tests this saved ~30% off the cache load time from the file system (once you factor in deserialization, file access times etc).
				delete (product as Partial<Mutable<typeof product>>).ETag;
				delete (product as Partial<Mutable<typeof product>>)._links;
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
			)._embedded["nice.publications:product-type-list"]._embedded[
				"nice.publications:product-type"
			]
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
			)._embedded["nice.publications:area-of-interest-type-list"]._embedded[
				"nice.publications:area-of-interest-type"
			]
	);
