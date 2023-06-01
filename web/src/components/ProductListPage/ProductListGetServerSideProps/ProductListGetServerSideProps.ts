import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import {
	search,
	initialise as initSearchClient,
	getSearchUrl,
	getActiveModifiers,
	getUrlPathAndQuery,
	SortOrder,
	Modifier,
	Navigator,
	SearchIndex,
} from "@nice-digital/search-client";

import { getRedirectUrl } from "@/components/ProductListPage/redirects";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/datetime";

import { ProductListPageProps, ActiveModifier } from "../ProductListPageProps";

export const defaultPageSize = 10;

export interface GetGetServerSidePropsOptions {
	/** Pre-filter for the guidance status type (gst) 'or modifier' that gets passed to search */
	gstPreFilter:
		| "Published"
		| "In consultation"
		| "In development"
		| "Awaiting development"
		| "Topic selection";
	defaultSortOrder: SortOrder;
	dateFilterLabel?: string;
	index: SearchIndex;
}

export const getGetServerSidePropsFunc =
	({
		gstPreFilter,
		defaultSortOrder,
		dateFilterLabel,
		index,
	}: GetGetServerSidePropsOptions) =>
	async (
		context: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<ProductListPageProps>> => {
		const redirectUrl = getRedirectUrl(context);

		if (redirectUrl)
			return { redirect: { destination: redirectUrl, permanent: true } };

		initSearchClient({
			baseURL: publicRuntimeConfig.search.baseURL,
			index: index,
		});

		const searchUrl = getSearchUrl(context.resolvedUrl);

		const searchStartTime = process.hrtime.bigint(),
			results = await search(context.resolvedUrl, {
				defaultSortOrder,
				defaultPageSize,
				usePrettyUrls: true,
				orModifierPreFilter: { gst: [gstPreFilter] },
			}),
			searchEndTime = process.hrtime.bigint();

		context.res.setHeader(
			"Server-Timing",
			`search;dur=${Math.round(
				Number(searchEndTime - searchStartTime) / 1000000
			)}`
		);

		if (results.failed) {
			logger.error(
				`Error loading guidance from search on page ${context.resolvedUrl}: ${results.errorMessage}`,
				results.debug?.rawResponse
			);

			context.res.statusCode = 500;

			return {
				props: {
					results,
					activeModifiers: [],
					searchUrl,
				},
			};
		}

		const activeModifiers = getActiveModifiers(results)
			.filter(withoutGuidanceStatusModifier)
			.map(toActiveModifier(results.navigators));

		if (searchUrl.from && searchUrl.to) {
			// Add an active modifier for the date range to allow users to easily toggle it
			activeModifiers.unshift({
				displayName: `${dateFilterLabel} between ${dayjs(searchUrl.from).format(
					dateFormatShort
				)} and ${dayjs(searchUrl.to).format(dateFormatShort)}`,
				toggleUrl: getUrlPathAndQuery({
					...searchUrl,
					sp: "on",
					from: undefined,
					to: undefined,
				}),
			});
		}

		if (searchUrl.q) {
			activeModifiers.unshift({
				displayName: searchUrl.q,
				toggleUrl: getUrlPathAndQuery({
					...searchUrl,
					sp: undefined,
					q: undefined,
				}),
			});
		}

		return {
			props: {
				results,
				activeModifiers,
				searchUrl,
			},
		};
	};

/**
 * Returns true if the given modifier is not filtering by guidance status, otherwise false.
 *
 * We pre filter by guidance status so don't want to be able to toggle it in the UI
 *
 * @returns A boolean indicating whether the given modifier is not guidance status
 */
const withoutGuidanceStatusModifier = (modifier: Modifier) =>
	modifier.navigatorShortName !== "gst";

/**
 * Gets a function that maps a modifier into an active modifier
 */
const toActiveModifier =
	(navigators: Navigator[]) =>
	({
		navigatorShortName,
		displayName,
		toggleUrl: { fullUrl: toggleUrl },
	}: Modifier): ActiveModifier => ({
		displayName: `${
			navigators.find((nav) => nav.shortName === navigatorShortName)
				?.displayName
		}: ${displayName}`,
		toggleUrl,
	});
