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
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Link } from "@/components/Link/Link";
import { SearchCardList } from "@/components/SearchCard/SearchCardList";
import { SearchListFilters } from "@/components/SearchListFilters/SearchListFilters";
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

export function Search({
	results,
	searchUrl: { q, s, from, to },
	activeModifiers,
}: SearchPageProps): JSX.Element {
	// Announcement text, used for giving audible notifications to screen readers when results have changed
	const [announcement, setAnnouncement] = useState("");

	const { failed } = results;

	const { asPath } = useRouter();

	const {
		documents,
		navigators,
		pageSize,
		firstResult,
		lastResult,
		resultCount,
		unfilteredResultsUrl,
	} = results as SearchResultsSuccess;

	useEffect(() => {
		setAnnouncement(
			`Showing ${firstResult} to ${lastResult} of ${resultCount}`
		);
	}, [firstResult, lastResult, resultCount]);

	if (failed) return <ErrorPageContent />;

	console.log(results);
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
						navigators={navigators}
						pageSize={pageSize === searchUrlDefaults.ps ? "" : pageSize}
						sortOrder={s}
						queryText={q}
						from={from}
						to={to}
						showDateFilter={false}
						showTextFilter={false}
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
						{resultCount === 0 ? (
							"Showing 0 results"
						) : (
							<>
								Showing {firstResult} to {lastResult} of {resultCount}
							</>
						)}
					</FilterSummary>

					{documents.length === 0 ? (
						<p id="results">
							We can&apos;t find any results. Try{" "}
							<Link to={unfilteredResultsUrl?.fullUrl as string} scroll={false}>
								clearing your filters
							</Link>{" "}
							and starting again.
						</p>
					) : (
						<SearchCardList documents={documents} />
					)}
					<SearchPagination results={results} scrollTargetId="filter-summary" />
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
							results.navigators.find(
								(nav) => nav.shortName === navigatorShortName
							)?.displayName
						}: ${displayName}`,
						toggleUrl,
					})
			  );

	if (results.failed) {
		logger.error(
			`Error loading guidance from search on page ${context.resolvedUrl}: ${results.errorMessage}`,
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
