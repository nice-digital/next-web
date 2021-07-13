import needle from "needle";

import type { Mutable } from "type-fest";

import {
	AreaOfInterest,
	AreasOfInterestList,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypeList,
	FeedPath,
} from "./types";
import { serverRuntimeConfig } from "@/config";
import { cache, getCacheKey } from "@/cache";

export * from "./types";

const { apiKey, origin } = serverRuntimeConfig.feeds.publications,
	{ defaultTTL, longTTL } = serverRuntimeConfig.cache;

/**
 * Gets a list of products from the 'products lite' endpoint.
 */
export const getAllProducts = async (): Promise<ProductLite[]> =>
	await getFeedBodyCached<ProductLite[]>(
		FeedPath.ProductsLite,
		defaultTTL,
		async () =>
			(
				await getFeedBodyUnCached<ProductListLite>(FeedPath.ProductsLite)
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
		FeedPath.ProductTypes,
		longTTL,
		async () =>
			(
				await getFeedBodyUnCached<ProductTypeList>(FeedPath.ProductTypes)
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
		FeedPath.AreasOfInterest,
		longTTL,
		async () =>
			(
				await getFeedBodyUnCached<AreasOfInterestList>(FeedPath.AreasOfInterest)
			)._embedded["nice.publications:area-of-interest-type-list"]._embedded[
				"nice.publications:area-of-interest-type"
			]
	);

/**
 * Gets the body of a feed directly from publications
 *
 * @param path The path of the feed to request
 * @returns The body of the feed
 */
const getFeedBodyUnCached = async <T>(path: FeedPath) =>
	(
		await needle("get", origin + path, {
			json: true,
			headers: {
				"Api-Key": apiKey,
			},
		})
	).body as T;

/**
 * Gets the body of a feed from the cache, if it exists.
 * If the item isn't in cache then it will hit the publications feed endpoint directly to get fresh data.
 *
 * @param path The path of the feed endpoint to request
 * @param ttl The TTL (time to live) of the entry
 * @param getUncachedAction Function that gets the uncached feed directly from publications.
 * @returns The body of the feed
 */
const getFeedBodyCached = async <T>(
	path: FeedPath,
	ttl: number,
	getUncachedAction: () => Promise<T>
) =>
	cache.wrap<T>(getCacheKey("publications", path), getUncachedAction, { ttl });
