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
import { Container } from "@nice-digital/nds-container";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Table } from "@nice-digital/nds-table";
import {
	Document,
	KnownOrModifierKeys,
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

import { PrioritisationListFilterSummary } from "./PrioritisationListFilterSummary/PrioritisationListFilterSummary";
import { defaultPageSize } from "./PrioritisationListGetServerSideProps/PrioritisationListGetServerSideProps";
import styles from "./PrioritisationListPage.module.scss";
import { PrioritisationListPageProps } from "./PrioritisationListPageProps";

export { getGetServerSidePropsFunc } from "./PrioritisationListGetServerSideProps/PrioritisationListGetServerSideProps";

const resultsPerPage = [
	{ count: 10, label: "10" },
	{ count: 25, label: "25" },
	{ count: 50, label: "50" },
	{ count: 9999, label: "All" },
];

export type GetPrioritisationListPageOptions = {
	metaDescription: string;
	breadcrumbTrail: ReactElement<BreadcrumbsProps>[];
	currentBreadcrumb: string;
	preheading: ReactChild;
	heading: ReactChild;
	intro?: ReactChild;
	description?: ReactChild;
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
	navigatorsOrder?: KnownOrModifierKeys[];
	navigatorsToCollapse?: KnownOrModifierKeys[];
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
 * Gets the prioritisation board decisions list page component with the given options
 *
 * @returns A prioritisation board decisions list page component
 */
export const getPrioritisationListPage =
	({
		metaDescription,
		breadcrumbTrail,
		currentBreadcrumb,
		preheading,
		heading,
		intro,
		description,
		title,
		defaultSort,
		secondarySort,
		showDateFilter,
		dateFilterLabel,
		textFilterHeading,
		useFutureDates,
		navigatorsOrder = ["nai", "tt", "tsd", "ndt", "ngt", "nat", "rty", "sub"],
		navigatorsToCollapse = ["ngt", "nat"],
		tableBodyRender,
		searchInputPlaceholder,
	}: GetPrioritisationListPageOptions): FC<PrioritisationListPageProps> =>
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

				<PageHeader
					variant="fullWidthLight"
					breadcrumbs={breadcrumbs}
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
					description={description}
					verticalPadding="loose"
				/>
				<Container>
					<h2>Medicines</h2>
					<p>
						The
						<a href="https://www.gov.uk/government/publications/2024-voluntary-scheme-for-branded-medicines-pricing-access-and-growth">
							2024 voluntary scheme for branded medicines, pricing, access and
							growth
						</a>
						states that NICE will continue to evaluate all new active substances
						and significant indications, except where there is a clear rationale
						not to do so.
					</p>
					<p>
						These new active substances and significant indications will not go
						through the NICE-wide topic prioritisation process and will be
						routed to technology appraisal guidance, except when there is a
						clear rationale not to do so.
					</p>
					<h2>Interventional procedures</h2>
					<p>
						All selected interventional procedures are directly routed to health
						technology guidance (HTG) for an assessment of the safety, efficacy,
						evidence or cost. All these topics will be shared with the
						<a href="https://www.nice.org.uk/process/pmg46/chapter/eligibility-criteria-for-using-the-prioritisation-framework-and-direct-routing-to-guidance#topics-that-involve-use-of-new-interventional-procedures">
							NICE prioritisation board
						</a>
						so it will have the oversight of the whole NICE guidance portfolio.
					</p>
					<p>
						In some circumstances, where there is uncertainty on a new topic
						that needs ratification or further
						<a href="https://www.nice.org.uk/process/pmg46/chapter/terms-used-in-this-manual#routing">
							routing
						</a>
						decision from the NICE prioritisation board, a topic briefing will
						be developed for use with the prioritisation framework.
					</p>
					<p>
						Decisions will only be reviewed where there are factual errors or
						when significant new evidence comes to light following publication
						of the decision.
					</p>
					<p>
						Stakeholders can seek clarification within 20 working days following
						the publication of the prioritisation board's decisions.
					</p>
					<ul>
						<li>
							<p>
								<a
									href="https://www.nice.org.uk/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions/request-for-prioritisation-clarification"
									target="_self"
								>
									Request prioritisation clarification
								</a>
							</p>
						</li>
					</ul>
				</Container>

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
							showDateFilter={showDateFilter}
							showTextFilter={true}
							dateFilterLabel={dateFilterLabel}
							textFilterHeading={textFilterHeading}
							useFutureDates={useFutureDates}
							navigatorsOrder={navigatorsOrder}
							navigatorsToCollapse={navigatorsToCollapse}
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
						<PrioritisationListFilterSummary
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
										<a href="/guidance/conditions-and-diseases">
											Browsing by topic
										</a>
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
