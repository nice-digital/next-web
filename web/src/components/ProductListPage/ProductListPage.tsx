import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import pluralize from "pluralize";
import {
	ElementType,
	FC,
	ReactChild,
	ReactElement,
	useEffect,
	useMemo,
	useState,
} from "react";

import {
	Breadcrumb,
	Breadcrumbs,
	type BreadcrumbsProps,
} from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Table } from "@nice-digital/nds-table";
import {
	Document,
	removeQueryParam,
	SearchResultsSuccess,
	SortOrder,
	upsertQueryParam,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { CopyToClipboard } from "@/components/CopyToClipboard/CopyToClipboard";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { Link, ScrollToLink } from "@/components/Link/Link";
import { SearchListFilters } from "@/components/SearchListFilters/SearchListFilters";
import { SearchPagination } from "@/components/SearchPagination/SearchPagination";
import { SkipLink } from "@/components/SkipLink/SkipLink";

import { ProductListFilterSummary } from "./ProductListFilterSummary/ProductListFilterSummary";
import { defaultPageSize } from "./ProductListGetServerSideProps/ProductListGetServerSideProps";
import styles from "./ProductListPage.module.scss";
import { ProductListPageProps } from "./ProductListPageProps";

export { getGetServerSidePropsFunc } from "./ProductListGetServerSideProps/ProductListGetServerSideProps";

const resultsPerPage = [
	{ count: 10, label: "10" },
	{ count: 25, label: "25" },
	{ count: 50, label: "50" },
	{ count: 9999, label: "All" },
];

export type GetProductListPageOptions = {
	metaDescription: string;
	listNavType: ElementType;
	breadcrumbTrail: ReactElement<BreadcrumbsProps>[];
	currentBreadcrumb: string;
	preheading: ReactChild;
	heading: ReactChild;
	intro?: ReactChild;
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
	showTextFilter?: boolean;
	dateFilterLabel?: string;
	textFilterLabel?: string;
	textFilterHeading?: string;
	useFutureDates?: boolean;
	tableBodyRender: (documents: Document[]) => JSX.Element;
	searchInputPlaceholder: string;
} & (
	| {
			showDateFilter: true;
			useFutureDates: boolean;
	  }
	| {
			showDateFilter: false;
	  }
);

/**
 * Gets a guidance or indicator list page component with the given options
 *
 * @returns A guidance or indicator list page component
 */
export const getProductListPage =
	({
		metaDescription,
		listNavType: ListNavType,
		breadcrumbTrail,
		currentBreadcrumb,
		preheading,
		heading,
		intro,
		title,
		defaultSort,
		secondarySort,
		showDateFilter,
		dateFilterLabel,
		textFilterHeading,
		useFutureDates,
		tableBodyRender,
		searchInputPlaceholder,
	}: GetProductListPageOptions): FC<ProductListPageProps> =>
	({
		results,
		searchUrl: { q, s, from, to, ps = defaultPageSize },
		activeModifiers,
	}) => {
		const { asPath, pathname } = useRouter();
		// Announcement text, used for giving audible notifications to screen readers when results have changed
		const [announcement, setAnnouncement] = useState(""),
			// Cache the breadcrumbs as they're static and it means we can use them on both the error view and success view
			breadcrumbs = useMemo(() => {
				return (
					<Breadcrumbs>
						{[
							<Breadcrumb to="/" key="home">
								Home
							</Breadcrumb>,
							...breadcrumbTrail,
							<Breadcrumb key="current page">{currentBreadcrumb}</Breadcrumb>,
						]}
					</Breadcrumbs>
				);
			}, []),
			{ failed } = results,
			{
				documents,
				navigators,
				pageSize,
				firstResult,
				lastResult,
				resultCount,
			} = results as SearchResultsSuccess;

		useEffect(() => {
			if (resultCount === 0) {
				setAnnouncement(
					`No results found for ${activeModifiers
						.map((a) => a.displayName)
						.join(", ")}`
				);
			} else {
				const sortOrder =
					s === "Title" ? "title" : s ? "date" : defaultSort.label;
				setAnnouncement(
					`Showing ${firstResult} to ${lastResult} of ${resultCount}, sorted by ${sortOrder.toLowerCase()}`
				);
			}
		}, [firstResult, lastResult, resultCount, q, s, from, to, activeModifiers]);

		if (failed)
			return (
				<>
					<NextSeo title={title} noindex={true} description={metaDescription} />
					<ErrorPageContent breadcrumbs={breadcrumbs} />
				</>
			);

		return (
			<>
				<NextSeo
					title={title}
					noindex={documents.length === 0}
					description={metaDescription}
				/>

				<Announcer announcement={announcement} />

				{breadcrumbs}

				<PageHeader
					preheading={preheading}
					heading={heading}
					id="content-start"
					className={`page-header ${styles.pageHeader}`}
					data-testid="content-start"
					lead={
						<>
							<SkipLink targetId="filters">Skip to filters</SkipLink>
							<SkipLink targetId="results">Skip to results</SkipLink>
							{intro}
						</>
					}
				/>

				<ListNavType />

				<Grid gutter="loose" className={styles.sectionWrapper}>
					<GridItem
						cols={12}
						md={4}
						lg={3}
						className={styles.panelWrapper}
						elementType="section"
						aria-label="Filter results"
					>
						<SearchListFilters
							numActiveModifiers={activeModifiers.length}
							navigators={navigators}
							pageSize={pageSize === defaultPageSize ? "" : pageSize}
							sortOrder={s === defaultSort.order ? "" : s}
							queryText={q}
							from={from}
							to={to}
							navigatorShortNamesToExclude="gst"
							showDateFilter={showDateFilter}
							showTextFilter={true}
							dateFilterLabel={dateFilterLabel}
							textFilterHeading={textFilterHeading}
							useFutureDates={useFutureDates}
							navigatorsOrder={[
								"nai",
								"tt",
								"tsd",
								"ndt",
								"ngt",
								"nat",
								"rty",
								"sub",
							]}
							searchInputPlaceholder={searchInputPlaceholder}
						/>
					</GridItem>

					<GridItem
						cols={12}
						md={8}
						lg={9}
						elementType="section"
						aria-labelledby="filter-summary"
					>
						<ProductListFilterSummary
							results={results as SearchResultsSuccess}
							activeModifiers={activeModifiers}
							currentSortOrder={s}
							defaultSort={defaultSort}
							secondarySort={secondarySort}
						/>

						{documents.length === 0 ? (
							<div id="results">
								<h2>No results found</h2>
								<p>
									Sorry, we haven’t found any results for you. You could try:
								</p>

								<ul>
									<li>Using the full site search.</li>
									<li>
										<Link href="/guidance/conditions-and-diseases">
											Browsing by topic
										</Link>
										. Our topic pages show all our guidance in a particular
										area, such as specific conditions or healthcare settings.
									</li>
									<li>
										<Link
											to={
												pathname +
												(ps && Number(ps) != defaultPageSize ? `?ps=${ps}` : "")
											}
										>
											Clearing your filters
										</Link>{" "}
										and starting again.
									</li>
								</ul>
							</div>
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
										<h3 className={styles.resultsPerPageHeading}>
											Results per page
										</h3>
										<ol
											className={`list list--piped ${styles.resultsPerPageList}`}
										>
											{resultsPerPage.map(({ count, label }) => (
												<li key={label}>
													{Number(ps) === count ? (
														label
													) : (
														<ScrollToLink
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
