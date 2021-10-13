import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextSeo } from "next-seo";
import React, { useEffect, useMemo, useState } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { FilterSummary } from "@nice-digital/nds-filters";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Table } from "@nice-digital/nds-table";
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
import { GuidanceListFilters } from "@/components/GuidanceListFilters/GuidanceListFilters";
import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { Link } from "@/components/Link/Link";
import { SearchPagination } from "@/components/SearchPagination/SearchPagination";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/constants";
import { formatDateStr } from "@/utils/index";

import styles from "./published.module.scss";

// NOTE: Page size cannot be less than 10 due to a bug in Search
// See https://github.com/nice-digital/search/blob/958b9eeab53db990aa5a8e4490703454db9b5dbd/Client/NICE.Search.Common/Models/PagerLinks.cs#L28
const searchUrlDefaults = {
	s: "Date",
	ps: 10,
};

export interface PublishedGuidancePageProps {
	results: SearchResults;
	activeModifiers: { displayName: string; toggleUrl: string }[];
	searchUrl: SearchUrl;
}

export function Published({
	results,
	searchUrl: { q, s, from, to },
	activeModifiers,
}: PublishedGuidancePageProps): JSX.Element {
	// Announcement text, used for giving audible notifications to screen readers when results have changed
	const [announcement, setAnnouncement] = useState(""),
		// Cache the breadcrumbs as they're static and it means we can use them on both the error view and success view
		breadcrumbs = useMemo(
			() => (
				<Breadcrumbs>
					<Breadcrumb to="/">Home</Breadcrumb>
					<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
					<Breadcrumb>
						Published guidance, quality standards and&nbsp;advice
					</Breadcrumb>
				</Breadcrumbs>
			),
			[]
		),
		{ failed } = results,
		{
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

	useEffect(() => {
		console.log("results.pagerLinks.next: ", results.pagerLinks.next);
	}, [results]);

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

			{breadcrumbs}

			<PageHeader
				preheading="Published "
				heading="Guidance, quality standards and&nbsp;advice"
				lead={
					<>
						<SkipLink targetId="filters">Skip to filters</SkipLink>
						<SkipLink targetId="results">Skip to results</SkipLink>
					</>
				}
			/>

			<GuidanceListNav />

			<Grid gutter="loose" className={styles.sectionWrapper}>
				<GridItem
					cols={12}
					md={4}
					lg={3}
					className={styles.panelWrapper}
					elementType="section"
					aria-label="Filter results"
				>
					<GuidanceListFilters
						numActiveModifiers={activeModifiers.length}
						navigators={navigators}
						pageSize={pageSize === searchUrlDefaults.ps ? "" : pageSize}
						sortOrder={s === searchUrlDefaults.s ? "" : s}
						queryText={q}
						from={from}
						to={to}
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
								label: s === "Title" ? "Title" : "Date",
							},
							{
								active: false,
								label: s !== "Title" ? "Title" : "Date",
								destination: "?s=" + (s !== "Title" ? "Title" : "Date"),
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
							We can&apos;t find any guidance or advice. Try{" "}
							<Link to={unfilteredResultsUrl?.fullUrl as string} scroll={false}>
								clearing your filters
							</Link>{" "}
							and starting again.
						</p>
					) : (
						<Table aria-describedby="filter-summary" id="results">
							<caption className="visually-hidden">
								Published guidance, quality standards and advice
							</caption>
							<thead>
								<tr>
									<th scope="col">Title</th>
									<th scope="col">Reference number</th>
									<th scope="col">Published</th>
									<th scope="col">Last updated</th>
								</tr>
							</thead>
							<tbody>
								{documents.map(
									({
										id,
										title,
										guidanceRef,
										publicationDate,
										lastUpdated,
										pathAndQuery,
									}) => {
										return (
											<tr key={id}>
												<td>
													<a
														href={pathAndQuery}
														dangerouslySetInnerHTML={{ __html: title }}
													/>
												</td>
												<td>{guidanceRef}</td>
												<td>
													<time
														className={styles.tableDate}
														dateTime={String(publicationDate)}
														data-shortdate={formatDateStr(
															String(publicationDate),
															true
														)}
													>
														<span>
															{formatDateStr(String(publicationDate))}
														</span>
													</time>
												</td>
												<td>
													<time
														className={styles.tableDate}
														dateTime={String(lastUpdated)}
														data-shortdate={formatDateStr(
															String(lastUpdated),
															true
														)}
													>
														<span>{formatDateStr(String(lastUpdated))}</span>
													</time>
												</td>
											</tr>
										);
									}
								)}
							</tbody>
						</Table>
					)}
					<SearchPagination results={results} />
				</GridItem>
			</Grid>
		</>
	);
}

export default Published;

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PublishedGuidancePageProps>> => {
	initialise({
		baseURL: publicRuntimeConfig.search.baseURL,
		index: "guidance",
		usePrettyUrls: true,
	});

	const searchUrl: SearchUrl = {
			...searchUrlDefaults,
			...getSearchUrl(context.resolvedUrl),
			// Pre filter results to just show published products for this tab
			...{ gst: "Published" },
		},
		results = await search(searchUrl),
		activeModifiers = results.failed
			? []
			: getActiveModifiers(results)
					.filter(
						// We pre filter by guidance status so don't want to be able to remove it
						(mod) => mod.navigatorShortName !== "gst"
					)
					.map(
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
