import dayjs from "dayjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextSeo } from "next-seo";
import pluralize from "pluralize";
import React, { FC, ReactChild, useEffect, useMemo, useState } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
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
	SortOrder,
	Document,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { CopyToClipboard } from "@/components/CopyToClipboard/CopyToClipboard";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GuidanceListFilters } from "@/components/GuidanceListFilters/GuidanceListFilters";
import { GuidanceListFilterSummary } from "@/components/GuidanceListFilterSummary/GuidanceListFilterSummary";
import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { getRedirectUrl } from "@/components/GuidanceListPage/redirects";
import { Link } from "@/components/Link/Link";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { dateFormatShort } from "@/utils/constants";

import styles from "./GuidanceListPage.module.scss";

const defaultPageSize = 10;

export type GetGuidanceListPageOptions = {
	breadcrumb: ReactChild;
	preheading: ReactChild;
	heading: ReactChild;
	title: string;
	defaultSortOrder: SortOrder;
	showDateFilter: boolean;
	dateFilterLabel?: string;
	tableBodyRender: (documents: Document[]) => JSX.Element;
} & (
	| { showDateFilter: true; dateFilterLabel: string }
	| { showDateFilter: false }
);

export interface GuidanceListPageProps {
	results: SearchResults;
	activeModifiers: { displayName: string; toggleUrl: string }[];
	searchUrl: SearchUrl;
}

export const getGuidanceListPage =
	({
		breadcrumb,
		preheading,
		heading,
		title,
		defaultSortOrder,
		showDateFilter,
		dateFilterLabel,
		tableBodyRender,
	}: GetGuidanceListPageOptions): FC<GuidanceListPageProps> =>
	({ results, searchUrl: { q, s, from, to }, activeModifiers }) => {
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

		useEffect(() => {
			setAnnouncement(
				`Showing ${firstResult} to ${lastResult} of ${resultCount}`
			);
		}, [firstResult, lastResult, resultCount]);

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

				<Announcer announcement={announcement} />

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
							sortOrder={s === defaultSortOrder ? "" : s}
							queryText={q}
							from={from}
							to={to}
							showDateFilter={showDateFilter}
							dateFilterLabel={dateFilterLabel}
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
							defaultSortOrder={defaultSortOrder}
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
								<Table aria-describedby="filter-summary" id="results">
									{tableBodyRender(documents)}
								</Table>
								<CopyToClipboard targetId="results">
									Copy {pluralize("result", documents.length, true)} to
									clipboard
								</CopyToClipboard>
							</>
						)}
					</GridItem>
				</Grid>
			</>
		);
	};

export interface GetGetServerSidePropsOptions {
	gstPreFilter: "Published" | "In consultation" | "In development" | "Proposed";
	defaultSortOrder: SortOrder;
}

export const getGetServerSidePropsFunc =
	({ gstPreFilter, defaultSortOrder }: GetGetServerSidePropsOptions) =>
	async (
		context: GetServerSidePropsContext
	): Promise<GetServerSidePropsResult<GuidanceListPageProps>> => {
		const redirectUrl = getRedirectUrl(context);

		if (redirectUrl)
			return { redirect: { destination: redirectUrl, permanent: true } };

		initialise({
			baseURL: publicRuntimeConfig.search.baseURL,
			index: "guidance",
		});

		const searchUrl = getSearchUrl(context.resolvedUrl),
			results = await search(context.resolvedUrl, {
				defaultSortOrder,
				defaultPageSize,
				usePrettyUrls: true,
				orModifierPreFilter: { gst: [gstPreFilter] },
			}),
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
					sp: "on",
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
