import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { FilterSummary } from "@nice-digital/nds-filters";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import {
	search,
	initialise,
	SearchResults,
	getSearchUrl,
	getActiveModifiers,
	removeQueryParam,
	SearchUrl,
	SearchResultsSuccess,
	upsertQueryParam,
	getUrlPathAndQuery,
	Navigator,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Link } from "@/components/Link/Link";
import { SearchCardList } from "@/components/SearchCard/SearchCardList";
import { SearchListFilters } from "@/components/SearchListFilters/SearchListFilters";
import { SearchNoResults } from "@/components/SearchNoResults/SearchNoResults";
import { SearchPagination } from "@/components/SearchPagination/SearchPagination";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/constants";

const searchUrlDefaults = {
	ps: 10,
};

export interface SearchPageProps {
	results: SearchResults;
	activeModifiers: { displayName: string; toggleUrl: string }[];
	searchUrl: SearchUrl;
}

const flattenNavigators = (navigators: Navigator[]): Navigator[] => {
	const arr: Navigator[] = [];
	navigators.forEach((node) => {
		arr.push(node);
		node.modifiers.forEach((node) => {
			if (node.childNavigators) {
				node.childNavigators.forEach((child) => arr.push(child));
			}
		});
	});

	return arr;
};

export function Search({
	results,
	searchUrl: { q, s, from, to },
	activeModifiers,
}: SearchPageProps): JSX.Element {
	// Announcement text, used for giving audible notifications to screen readers when results have changed
	const [announcement, setAnnouncement] = useState("");

	const { failed } = results;

	const { asPath } = useRouter();
	const [loading, setLoading] = useState<boolean>();

	const {
		documents,
		navigators,
		pageSize,
		unfilteredResultsUrl,
		finalSearchText,
	} = results as SearchResultsSuccess;

	// useEffect(() => {
	// 	// TODO check if this is redundant
	// 	setAnnouncement(
	// 		`Showing ${firstResult} to ${lastResult} of ${resultCount}`
	// 	);
	// }, [firstResult, lastResult, resultCount]);

	const flattenedNavigators = flattenNavigators(navigators);

	const SummaryRecordCount = ({
		firstResult,
		lastResult,
		resultCount,
		finalSearchText,
	}: SearchResultsSuccess) => {
		return (
			<>
				Showing{" "}
				{resultCount === 1
					? "1 result"
					: `${firstResult} to ${lastResult} of ${resultCount} results`}
				{finalSearchText && (
					<>
						{" "}
						for <strong>{finalSearchText}</strong>
					</>
				)}
			</>
		);
	};

	const SummaryText = (results: SearchResultsSuccess) => {
		const { originalSearch, finalSearchText, resultCount } = results;

		if (resultCount === 0 && !originalSearch) {
			return (
				<>
					We couldn&apos;t find any results for{" "}
					<strong>{finalSearchText}</strong>
					<br />
					Check for spelling mistakes or try another search term.
				</>
			);
		}

		if (originalSearch) {
			return (
				<>
					Your search for <strong>{originalSearch.searchText}</strong> returned
					no results
					<br />
					<SummaryRecordCount {...results} />
				</>
			);
		}

		if (resultCount !== 0) {
			return <SummaryRecordCount {...results} />;
		}

		return null;
	};

	useEffect(() => {
		if (failed) setAnnouncement("There was an error getting search results");

		if (loading) setAnnouncement("Loading search results");

		if (results && !failed) {
			const summary = `Showing ${results.firstResult} to ${results.lastResult} of ${results.resultCount}`;
			const spellcheck = results.finalSearchText
				? ` for ${results.finalSearchText}`
				: null;
			setAnnouncement(summary + spellcheck);
		}
	}, [results, failed, loading]);

	if (failed) return <ErrorPageContent />;

	return (
		<>
			<NextSeo
				title={
					q !== "" && q !== undefined
						? `${q} | Search results`
						: `Search results`
				}
			/>

			<Announcer announcement={announcement} />

			<h1 className="visually-hidden">Search results</h1>

			<Grid gutter="loose" className="pt--e">
				<GridItem
					cols={12}
					md={4}
					lg={3}
					elementType="section"
					aria-label="Filter results"
				>
					<SearchListFilters
						numActiveModifiers={activeModifiers.length}
						navigators={flattenedNavigators}
						pageSize={pageSize === searchUrlDefaults.ps ? "" : pageSize}
						sortOrder={s}
						queryText={q}
						from={from}
						to={to}
						showDateFilter={false}
						showTextFilter={false}
						navigatorsOrder={["nai", "ndt", "gst", "drm", "ngt", "nat"]}
					/>
				</GridItem>

				<GridItem
					cols={12}
					md={8}
					lg={9}
					elementType="section"
					aria-labelledby="filter-summary"
				>
					<FilterSummary
						id="filter-summary"
						activeFilters={activeModifiers.map(
							({ displayName, toggleUrl }) => ({
								label: displayName,
								destination: toggleUrl,
								method: "href",
								elementType: ({ children, ...props }) => (
									<Link {...props} scroll={false}>
										<a>{children}</a>
									</Link>
								),
							})
						)}
						sorting={[
							{
								active: true,
								label: s ? "Date" : "Relevance",
								destination: s
									? upsertQueryParam(asPath, "s", "Date")
									: upsertQueryParam(asPath, "s", "Relevance"),
							},
							{
								active: false,
								label: s ? "Relevance" : "Date",
								destination: s
									? removeQueryParam(asPath, "s")
									: upsertQueryParam(asPath, "s", "Date"),
								elementType: ({ ...props }) => (
									<Link {...props} scroll={false} />
								),
							},
						]}
					>
						{results?.resultCount === 0 ? (
							<>
								<h2 className="mt--0" id="results-title">
									No results found
								</h2>
								<SummaryText {...results} />
								<SearchNoResults
									searchText={
										results?.originalSearch?.searchText ||
										results?.finalSearchText
									}
								/>
							</>
						) : null}

						{/* TODO add loading state */}

						{results && results.resultCount !== 0 ? (
							<div
								id="search-results-summary"
								data-original-search-text={
									results.originalSearch?.searchText || ""
								}
								data-final-search-text={results.finalSearchText}
								data-result-count={results.resultCount}
							>
								<SummaryText {...results} />
							</div>
						) : null}
					</FilterSummary>

					{results && results.resultCount !== 0 && documents.length === 0 ? (
						<p id="results">
							We can&apos;t find any results. Try{" "}
							<Link
								to={
									unfilteredResultsUrl?.fullUrl
										? (unfilteredResultsUrl.fullUrl as string)
										: "/unfilteredResultsUrl" //TODO fix unfilteredResultsUrl prop as it is undefined
								}
								scroll={false}
							>
								clearing your filters
							</Link>{" "}
							and starting again.
						</p>
					) : (
						<SearchCardList documents={documents} />
					)}
					{documents.length !== 0 ? (
						<SearchPagination
							results={results}
							scrollTargetId="filter-summary"
						/>
					) : null}
				</GridItem>
			</Grid>
		</>
	);
}

export default Search;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<SearchPageProps>> => {
	initialise({
		baseURL: publicRuntimeConfig.search.baseURL,
		index: "nice",
		usePrettyUrls: true,
	});

	const searchUrl: SearchUrl = {
			...searchUrlDefaults,
			...getSearchUrl(context.resolvedUrl),
		},
		results = await search(searchUrl, { usePrettyUrls: true }),
		activeModifiers = results.failed
			? []
			: getActiveModifiers(results).map(
					({
						navigatorShortName,
						displayName,
						toggleUrl: { fullUrl: toggleUrl },
					}) => ({
						displayName: `${
							flattenNavigators(results.navigators).find(
								(nav) => nav.shortName === navigatorShortName
							)?.displayName
						}: ${displayName}`,
						toggleUrl,
					})
			  );

	if (results.failed) {
		logger.error(
			`Error loading results from search on page ${context.resolvedUrl}: ${results.errorMessage}`,
			results.debug?.rawResponse
		);
		context.res.statusCode = 500;
	} else if (searchUrl.from && searchUrl.to) {
		// Add an active modifier for the date range to allow users to easily toggle it
		activeModifiers.unshift({
			displayName: `Last updated between ${dayjs(searchUrl.from).format(
				dateFormatShort
			)} and ${dayjs(searchUrl.to).format(dateFormatShort)}`,
			toggleUrl: getUrlPathAndQuery({
				...searchUrl,
				from: undefined,
				to: undefined,
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
