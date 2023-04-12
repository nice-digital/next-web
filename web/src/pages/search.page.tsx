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
	SearchUrl,
	SearchResultsSuccess,
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
import { dateFormatShort } from "@/utils/datetime";

const searchUrlDefaults = {
	ps: 15,
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
	results: data,
	searchUrl: { q, s, from, to },
	activeModifiers,
}: SearchPageProps): JSX.Element {
	// Announcement text, used for giving audible notifications to screen readers when results have changed
	const [announcement, setAnnouncement] = useState("");
	const [loading, setLoading] = useState<boolean>();
	const { failed } = data;

	const { events, push, query } = useRouter();

	const { documents, navigators, pageSize, unfilteredResultsUrl } =
		data as SearchResultsSuccess;

	const flattenedNavigators = flattenNavigators(navigators);

	useEffect(() => {
		if (data && data.failed)
			setAnnouncement("There was an error getting search results");

		if (loading) setAnnouncement("Loading search results");

		if (data && !data.failed) {
			const summary = `Showing ${data.firstResult} to ${data.lastResult} of ${data.resultCount}`;
			const spellcheck = data.finalSearchText
				? ` for ${data.finalSearchText}`
				: null;
			!loading && setAnnouncement(summary + spellcheck);
		}
	}, [data, loading]);

	useEffect(() => {
		const handleStart = () => {
			setLoading(true);
		};

		const handleStop = () => {
			setLoading(false);
		};

		events.on("routeChangeStart", handleStart);
		events.on("routeChangeComplete", handleStop);
		events.on("routeChangeError", handleStop);

		return () => {
			events.off("routeChangeStart", handleStart);
			events.off("routeChangeComplete", handleStop);
			events.off("routeChangeError", handleStop);
		};
	}, [events]);

	if (failed) return <ErrorPageContent />;

	const SummaryRecordCount = ({
		firstResult,
		lastResult,
		resultCount,
		finalSearchText,
	}: SearchResultsSuccess) => {
		return loading ? (
			<>
				<span>Loading search results...</span>
			</>
		) : (
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

	const SummaryText = (data: SearchResultsSuccess) => {
		const { originalSearch, finalSearchText, resultCount } = data;

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
					<SummaryRecordCount {...data} />
				</>
			);
		}

		if (resultCount !== 0) {
			return <SummaryRecordCount {...data} />;
		}

		return null;
	};

	// const window.dataLayer = window.dataLayer || [];

	return (
		<>
			<NextSeo
				title={
					q !== "" && q !== undefined
						? `${q} | Search results`
						: `Search results`
				}
				noindex
			/>
			<Announcer announcement={announcement} />
			<h1 className="visually-hidden">Search results</h1>

			{data?.resultCount === 0 && activeModifiers.length === 0 ? (
				<>
					<h2 id="results-title">No results found</h2>
					<SearchNoResults
						searchText={
							data?.originalSearch?.searchText || data?.finalSearchText
						}
					/>
				</>
			) : (
				<>
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
												{children}
											</Link>
										),
									})
								)}
								sorting={[
									{
										active: !s,
										label: "Relevance",
										value: "relevance",
										onSelected: () => {
											// eslint-disable-next-line @typescript-eslint/no-unused-vars
											const { s, ...modifiedQuery } = query;
											window.dataLayer &&
												window.dataLayer.push({
													event: "sort",
													sort_by: "relevance",
												});
											push({
												query: modifiedQuery,
											});
										},
									},
									{
										active: s == "date",
										label: "Date",
										value: "date",
										onSelected: () => {
											window.dataLayer &&
												window.dataLayer.push({
													event: "sort",
													sort_by: "date",
												});
											push({ query: { ...query, s: "date" } });
										},
									},
								]}
							>
								<div
									id="search-results-summary"
									data-original-search-text={
										data.originalSearch?.searchText || ""
									}
									data-final-search-text={data.finalSearchText}
									data-result-count={data.resultCount}
								>
									<SummaryText {...data} />
								</div>
							</FilterSummary>

							{documents.length === 0 ? (
								<p id="results">
									We can&apos;t find any results. Try{" "}
									<Link
										to={unfilteredResultsUrl?.fullUrl as string}
										scroll={false}
									>
										clearing your filters
									</Link>{" "}
									and starting again.
								</p>
							) : (
								<>
									<SearchCardList documents={documents} />
									<SearchPagination
										results={data}
										scrollTargetId="filter-summary"
									/>
								</>
							)}
						</GridItem>
					</Grid>
				</>
			)}
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
