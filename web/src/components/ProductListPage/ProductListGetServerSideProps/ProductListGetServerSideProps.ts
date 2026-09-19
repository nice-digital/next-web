import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import {
	getActiveModifiers,
	getSearchUrl,
	getUrlPathAndQuery,
	initialise as initSearchClient,
	Modifier,
	Navigator,
	search,
	SearchIndex,
	SortOrder,
} from "@nice-digital/search-client";

import { getRedirectUrl } from "@/components/ProductListPage/redirects";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/datetime";

import { ActiveModifier, ProductListPageProps } from "../ProductListPageProps";

export const defaultPageSize = 10;

/**
 * The results-per-page options in ProductListPage's UI. They live here, rather
 * than in the component, so the query sanitisation below can't drift from the
 * sizes the UI actually offers.
 */
export const resultsPerPage = [
	{ count: 10, label: "10" },
	{ count: 25, label: "25" },
	{ count: 50, label: "50" },
	{ count: 9999, label: "All" },
];

const allowedPageSizes = resultsPerPage.map(({ count }) => count);

// Elastic's index.max_result_window
const maxResultWindow = 10000;

// Expensive search params the list page UI never emits
const strippedParams = new Set(["sa", "aggsonly", "fc", "co", "sm", "pt"]);

/**
 * Clamps the query string of a list page URL to values the UI can actually
 * produce, so uncapped ps/pa/sa params can't turn cheap requests into
 * expensive uncacheable search queries. Returns the URL unchanged when
 * nothing needed clamping, so organic UI-generated URLs never redirect.
 */
export const sanitiseListPageQuery = (resolvedUrl: string): string => {
	const [path, queryString = ""] = resolvedUrl.split("?"),
		params = new URLSearchParams(queryString);

	let changed = false;

	const keys: string[] = [];
	params.forEach((_value, key) => keys.push(key));
	for (const key of keys)
		if (strippedParams.has(key.toLowerCase())) {
			params.delete(key);
			changed = true;
		}

	// The checks below only read the first value of each param, so collapse
	// duplicates: otherwise ?ps=25&ps=9999 sneaks an unclamped value through
	for (const key of ["ps", "pa"]) {
		const values = params.getAll(key);
		if (values.length > 1) {
			params.set(key, values[0]);
			changed = true;
		}
	}

	const psRaw = params.get("ps");
	let pageSize = defaultPageSize;
	if (psRaw !== null) {
		// Round down to the largest allowed size, never up, so junk like ps=40
		// can't be clamped into a more expensive query than the one requested
		const ps = Number(psRaw),
			clamped = Number.isFinite(ps)
				? allowedPageSizes.reduce(
						(best, size) => (size <= ps && size > best ? size : best),
						defaultPageSize
				  )
				: defaultPageSize;

		if (clamped === defaultPageSize) {
			params.delete("ps");
			changed = true;
		} else {
			pageSize = clamped;
			if (String(clamped) !== psRaw) {
				params.set("ps", String(clamped));
				changed = true;
			}
		}
	}

	const paRaw = params.get("pa");
	if (paRaw !== null) {
		const pa = Number(paRaw);
		if (!Number.isInteger(pa) || pa < 1 || pa * pageSize > maxResultWindow) {
			params.delete("pa");
			changed = true;
		} else if (String(pa) !== paRaw) {
			params.set("pa", String(pa));
			changed = true;
		}
	}

	if (!changed) return resolvedUrl;

	const sanitisedQueryString = params.toString();
	return sanitisedQueryString ? `${path}?${sanitisedQueryString}` : path;
};

export interface GetGetServerSidePropsOptions {
	/** Pre-filter for the guidance status type (gst) 'or modifier' that gets passed to search */
	gstPreFilter?:
		| "Published"
		| "In consultation"
		| "In development"
		| "Awaiting development"
		| "Topic prioritisation"
		| "Terminated"
		| "Deferred";
	defaultSortOrder: SortOrder;
	dateFilterLabel?: string;
	textFilterLabel?: string;
	index: SearchIndex;
}

export const getGetServerSidePropsFunc =
	({
		gstPreFilter,
		defaultSortOrder,
		dateFilterLabel,
		textFilterLabel = "Keyword or reference number",
		index,
	}: GetGetServerSidePropsOptions) =>
	async (
		context: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<ProductListPageProps>> => {
		const redirectUrl = getRedirectUrl(context);

		if (redirectUrl)
			return { redirect: { destination: redirectUrl, permanent: true } };

		// 302 not 301: don't let junk URLs poison permanent redirect caches
		const canonicalUrl = sanitiseListPageQuery(context.resolvedUrl);
		if (canonicalUrl !== context.resolvedUrl)
			return { redirect: { destination: canonicalUrl, permanent: false } };

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
				orModifierPreFilter: gstPreFilter ? { gst: [gstPreFilter] } : undefined,
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
				{ rawResponse: results.debug?.rawResponse },
				`Error loading guidance from search on page ${context.resolvedUrl}: ${results.errorMessage}`
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
				displayName: `${dateFilterLabel} between: ${dayjs(
					searchUrl.from
				).format(dateFormatShort)} and ${dayjs(searchUrl.to).format(
					dateFormatShort
				)}`,
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
				displayName: `${textFilterLabel}: ${searchUrl.q}`,
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
