import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import React, { FC, ReactChild, useEffect, useMemo, useState } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Table } from "@nice-digital/nds-table";
import {
	SearchResultsSuccess,
	SortOrder,
	Document,
	upsertQueryParam,
	removeQueryParam,
	getSearchUrl,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { CopyToClipboard } from "@/components/CopyToClipboard/CopyToClipboard";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GuidanceListFilters } from "@/components/GuidanceListPage/GuidanceListFilters/GuidanceListFilters";
import { GuidanceListFilterSummary } from "@/components/GuidanceListPage/GuidanceListFilterSummary/GuidanceListFilterSummary";
import { GuidanceListNav } from "@/components/GuidanceListPage/GuidanceListNav/GuidanceListNav";
import { Link, ScrollToLink } from "@/components/Link/Link";
import { SearchPagination } from "@/components/SearchPagination/SearchPagination";
import { SkipLink } from "@/components/SkipLink/SkipLink";

import { defaultPageSize } from "./GuidanceListGetServerSideProps/GuidanceListGetServerSideProps";
import styles from "./GuidanceListPage.module.scss";
import { GuidanceListPageProps } from "./GuidanceListPageProps";

export { getGetServerSidePropsFunc } from "./GuidanceListGetServerSideProps/GuidanceListGetServerSideProps";

const resultsPerPage = [
	{ count: 10, label: "10" },
	{ count: 25, label: "25" },
	{ count: 50, label: "50" },
	{ count: 9999, label: "All" },
];

export type GetGuidanceListPageOptions = {
	breadcrumb: ReactChild;
	preheading: ReactChild;
	heading: ReactChild;
	title: string;
	defaultSort: {
		order: SortOrder;
		label: string;
	};
	secondarySort?: {
		order: SortOrder;
		label: string;
	};
	showDateFilter: boolean;
	dateFilterLabel?: string;
	useFutureDates?: boolean;
	tableBodyRender: (documents: Document[]) => JSX.Element;
} & (
	| { showDateFilter: true; dateFilterLabel: string; useFutureDates: boolean }
	| {
			showDateFilter: false;
	  }
);

/**
 * Gets a guidance list page component with the given options
 *
 * @returns A guidance list page component
 */
export const getGuidanceListPage =
	({
		breadcrumb,
		preheading,
		heading,
		title,
		defaultSort,
		secondarySort,
		showDateFilter,
		dateFilterLabel,
		useFutureDates,
		tableBodyRender,
	}: GetGuidanceListPageOptions): FC<GuidanceListPageProps> =>
	({
		results,
		searchUrl: { q, s, from, to, ps = defaultPageSize },
		activeModifiers,
	}) => {
		const [announcementId, setAnnouncementId] = useState("");
		const { asPath } = useRouter();
		const router = useRouter();
		// Announcement text, used for giving audible notifications to screen readers when results have changed
		const [announcement, setAnnouncement] = useState(""),
			// Cache the breadcrumbs as they're static and it means we can use them on both the error view and success view
			breadcrumbs = useMemo(
				() => (
					<Breadcrumbs>
						<Breadcrumb to="/">Home</Breadcrumb>
						<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
						<Breadcrumb>{breadcrumb}</Breadcrumb>
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
			} = results as SearchResultsSuccess;

		const insertCommas = () => {
			const randomNumber = Math.floor(Math.random() * 20);
			const filledArray = [...new Array(randomNumber)].map(() => ",");
			return filledArray.join(",");
		};

		useEffect(() => {
			console.log(
				"setting announcement ",
				firstResult,
				lastResult,
				resultCount,
				q,
				s,
				from,
				to
			);
			if (resultCount === 0) {
				// setAnnouncement(`No results found ${insertCommas()}`);
				setAnnouncement("No results found");
			} else {
				setAnnouncement(
					`Showing ${firstResult} to ${lastResult} of ${resultCount}`
				);
			}
			setAnnouncementId(Math.random().toString(36).replace("0.", ""));
		}, [firstResult, lastResult, resultCount, q, s, from, to]);

		// useEffect(() => {
		// 	router.events.on("routeChangeComplete", () => {
		// 		console.log("route change routeChangeComplete");
		// 		console.log("guidance list page props ");
		// 		console.log("!!! router ", router);
		// 		console.log(">>> query", router.query);
		// 		console.log("### path", router.asPath);
		// 	});
		// 	return () => {
		// 		router.events.off("routeChangeComplete", () => {
		// 			console.log("stoped");
		// 		});
		// 	};
		// }, [router.events]);

		if (failed)
			return (
				<>
					<NextSeo title={title + " | Guidance"} noindex={true} />
					<ErrorPageContent breadcrumbs={breadcrumbs} />
				</>
			);

		return (
			<>
				<NextSeo
					title={title + " | Guidance"}
					noindex={documents.length === 0}
				/>

				<Announcer
					announcement={announcement}
					announcementId={announcementId}
				/>

				{breadcrumbs}

				<PageHeader
					preheading={preheading}
					heading={heading}
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
							pageSize={pageSize === defaultPageSize ? "" : pageSize}
							sortOrder={s === defaultSort.order ? "" : s}
							queryText={q}
							from={from}
							to={to}
							showDateFilter={showDateFilter}
							dateFilterLabel={dateFilterLabel}
							useFutureDates={useFutureDates}
						/>
					</GridItem>

					<GridItem
						cols={12}
						md={8}
						lg={9}
						elementType="section"
						aria-labelledby="filter-summary"
					>
						<GuidanceListFilterSummary
							results={results as SearchResultsSuccess}
							activeModifiers={activeModifiers}
							currentSortOrder={s}
							defaultSort={defaultSort}
							secondarySort={secondarySort}
						/>

						{documents.length === 0 ? (
							<p id="results">
								We can&apos;t find any matching products. Try{" "}
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
								<div className={styles.tableWrapper}>
									<Table
										aria-describedby="filter-summary"
										id="results"
										className={styles.table}
									>
										{tableBodyRender(documents)}
									</Table>
								</div>
								<SearchPagination
									results={results as SearchResultsSuccess}
									scrollTargetId="filter-summary"
								/>

								<Grid verticalAlignment="middle" className="mt--d">
									<GridItem cols={12} sm={6} className="mb--e mb--0-sm">
										<CopyToClipboard targetId="results">
											Copy {pluralize("result", documents.length, true)} to
											clipboard
										</CopyToClipboard>
									</GridItem>
									<GridItem cols={12} sm={6} className="text-right">
										<h3 className="p mt--0 mb--c">Results per page</h3>
										<ol className="list list--piped mv--0">
											{resultsPerPage.map(({ count, label }) => (
												<li key={label} className="pl--b">
													{Number(ps) === count ? (
														label
													) : (
														<ScrollToLink
															className="ph--0"
															aria-label={`Show ${label} results per page`}
															href={removeQueryParam(
																count === defaultPageSize
																	? removeQueryParam(asPath, "ps")
																	: upsertQueryParam(
																			asPath,
																			"ps",
																			String(count)
																	  ),
																"pa"
															)}
															scrollTargetId="filter-summary"
														>
															{label}
														</ScrollToLink>
													)}
												</li>
											))}
										</ol>
									</GridItem>
								</Grid>
							</>
						)}
					</GridItem>
				</Grid>
			</>
		);
	};
