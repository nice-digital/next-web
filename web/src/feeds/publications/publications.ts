import needle from "needle";
import {
	AreaOfInterest,
	AreasOfInterestList,
	ProductListLite,
	ProductLite,
	ProductType,
	ProductTypeList,
} from "./types";
import { serverRuntimeConfig } from "@/config";

const { apiKey, origin } = serverRuntimeConfig.feeds.publications,
	productsLiteFeedPath = "/feeds/products-lite",
	productTypesFeedPath = "/feeds/producttypes",
	areasOfInterestFeedPath = "/feeds/areaofinteresttypes";

type FeedPaths =
	| typeof productsLiteFeedPath
	| typeof productTypesFeedPath
	| typeof areasOfInterestFeedPath;

/**
 * Gets the body of a feed directly from publications
 * @param path The path of the feed to request
 * @returns The body of the feed
 */
const getFeedBodyUnCached = async <T>(path: FeedPaths) =>
	(
		await needle("get", origin + path, {
			json: true,
			headers: {
				"Api-Key": apiKey,
			},
		})
	).body as T;

const getFeedBodyCached = async <T>(path: FeedPaths) =>
	getFeedBodyUnCached<T>(path);
// cache.wrap<T>(getCacheKey("publications", path), () =>
// 	getFeedBodyUnCached<T>(path)
// );

/**
 * Gets a list of products from the 'products lite' endpoint.
 */
export const getAllProducts = async (): Promise<readonly ProductLite[]> =>
	(await getFeedBodyCached<ProductListLite>(productsLiteFeedPath))._embedded[
		"nice.publications:product-list-lite"
	]._embedded["nice.publications:product-lite"];

/**
 * Gets a list of product types.
 *
 * Note: there's no pre-filter so it includes both enabled _and_ disabled.
 */
export const getAllProductTypes = async (): Promise<readonly ProductType[]> =>
	(await getFeedBodyCached<ProductTypeList>(productTypesFeedPath))._embedded[
		"nice.publications:product-type-list"
	]._embedded["nice.publications:product-type"];

/**
 * Gets _all areas of interest e.g. Covid-19 and Antimicrbial prescribing.
 *
 * Note: there's no pre-filter so it includes both enabled _and_ disabled.
 */
export const getAllAreasOfInterest = async (): Promise<
	readonly AreaOfInterest[]
> =>
	(await getFeedBodyCached<AreasOfInterestList>(areasOfInterestFeedPath))
		._embedded["nice.publications:area-of-interest-type-list"]._embedded[
		"nice.publications:area-of-interest-type"
	];

export * from "./types";
