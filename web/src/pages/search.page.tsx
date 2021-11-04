import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useMemo, useState } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Card } from "@nice-digital/nds-card";
import { FilterSummary } from "@nice-digital/nds-filters";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import {
	search,
	initialise,
	SearchResults,
	getSearchUrl,
	getActiveModifiers,
	SearchUrl,
	SearchResultsSuccess,
	getUrlPathAndQuery,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GuidanceListFilters } from "@/components/GuidanceListPage/GuidanceListFilters/GuidanceListFilters";
import { GuidanceListNav } from "@/components/GuidanceListPage/GuidanceListNav/GuidanceListNav";
import { Link } from "@/components/Link/Link";
import { SearchPagination } from "@/components/SearchPagination/SearchPagination";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/constants";
import { formatDateStr } from "@/utils/index";

import styles from "./../components/GuidanceListPage/GuidanceListPage.module.scss";

// NOTE: Page size cannot be less than 10 due to a bug in Search
// See https://github.com/nice-digital/search/blob/958b9eeab53db990aa5a8e4490703454db9b5dbd/Client/NICE.Search.Common/Models/PagerLinks.cs#L28
const searchUrlDefaults = {
	s: "Relevance",
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
	// Cache the breadcrumbs as they're static and it means we can use them on both the error view and success view
	const breadcrumbs = useMemo(
		() => (
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				{failed ? (
					<Breadcrumb>Search</Breadcrumb>
				) : (
					<Breadcrumb>
						Search results for &quot;{results.finalSearchText}&quot;
					</Breadcrumb>
				)}
			</Breadcrumbs>
		),
		[]
	);

	const {
		documents,
		navigators,
		pageSize,
		firstResult,
		lastResult,
		resultCount,
		unfilteredResultsUrl,
		pagerLinks,
	} = results as SearchResultsSuccess;

	useEffect(() => {
		setAnnouncement(
			`Showing ${firstResult} to ${lastResult} of ${resultCount}`
		);
	}, [firstResult, lastResult, resultCount]);

	if (failed)
		return (
			<>
				<ErrorPageContent breadcrumbs={breadcrumbs} />
			</>
		);

	return (
		<>
			<NextSeo title="Published guidance, quality standards and advice" />

			<Announcer announcement={announcement} />

			{/* {breadcrumbs} */}

			{/* <PageHeader
				preheading="Search results for"
				heading={`${results.finalSearchText}`}
				lead={
					<>
						<SkipLink targetId="filters">Skip to filters</SkipLink>
						<SkipLink targetId="results">Skip to results</SkipLink>
					</>
				}
			/> */}

			<Grid gutter="loose" className={styles.sectionWrapper}>
				<GridItem
					cols={12}
					md={4}
					lg={3}
					className={styles.panelWrapper}
					elementType="section"
					aria-label="Filter results"
				>
					Filters here
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
						// sorting={[
						// 	{
						// 		active: true,
						// 		label: s === "Title" ? "Title" : "Date",
						// 	},
						// 	{
						// 		active: false,
						// 		label: s !== "Title" ? "Title" : "Date",
						// 		destination: "?s=" + (s !== "Title" ? "Title" : "Date"),
						// 		elementType: ({ ...props }) => (
						// 			<Link {...props} scroll={false} />
						// 		),
						// 	},
						// ]}
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
						<>
							{documents.map(
								({
									id,
									title,
									guidanceRef,
									publicationDate,
									lastUpdated,
									pathAndQuery,
									teaser,
									subSectionLinks,
									niceResultType,
								}) => {
									const formattedTitle = (
										<span dangerouslySetInnerHTML={{ __html: title }} />
									);
									const formattedTeaser = (
										<span dangerouslySetInnerHTML={{ __html: teaser }} />
									);

									function getMeta() {
										const things = [];
										if (niceResultType) {
											things.push({ label: "Type", value: niceResultType });
										}
										if (lastUpdated) {
											things.push({
												visibleLabel: true,
												label: "Last updated",
												value: formatDateStr(lastUpdated),
											});
										} else if (publicationDate) {
											things.push({
												visibleLabel: true,
												label: "Published on",
												value: formatDateStr(publicationDate),
											});
										}
										if (things.length === 0) return null;
										return things;
									}

									return (
										<>
											<Card
												headingText={formattedTitle}
												headingLink={pathAndQuery}
												key={id}
												summary={formattedTeaser}
												link={{
													destination: pathAndQuery,
												}}
												metadata={getMeta()}
											/>
											{subSectionLinks && (
												<details>
													<summary>Show all sections</summary>
													<pre>{subSectionLinks}</pre>
												</details>
											)}
											<hr />
										</>
									);
								}
							)}
						</>
					)}
					<SearchPagination results={results} />
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
		results = await search(searchUrl),
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
