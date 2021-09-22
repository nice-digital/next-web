import serialize from "form-serialize";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, {
	createRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import {
	FilterPanel,
	FilterGroup,
	FilterOption,
	FilterSummary,
} from "@nice-digital/nds-filters";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Table } from "@nice-digital/nds-table";
import {
	search,
	initialise,
	SearchResults,
	getSearchUrl,
	getActiveModifiers,
	Modifier,
	SearchUrl,
	SearchResultsSuccess,
} from "@nice-digital/search-client";

import { Announcer } from "@/components/Announcer/Announcer";
import { ErrorPageContent } from "@/components/ErrorPageContent/ErrorPageContent";
import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { InlineTextFilter } from "@/components/InlineTextFilter/InlineTextFilter";
import { Link } from "@/components/Link/Link";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { formatDateStr } from "@/utils/index";

import styles from "./published.module.scss";

const searchUrlDefaults = {
	s: "Date",
	ps: 10,
};

/** Search returns the order of navigators depending on what's selected but we want them in a consistent order */
const navigatorsOrder = ["nai", "ndt", "ngt", "nat"];

interface PublishedGuidancePageProps {
	results: SearchResults;
	activeModifiers: Modifier[];
	searchUrl: SearchUrl;
}

export function Published({
	results,
	searchUrl: { q, s },
	activeModifiers,
}: PublishedGuidancePageProps): JSX.Element {
	const router = useRouter(),
		formRef = createRef<HTMLFormElement>(),
		doClientSideFormSubmit = useCallback(() => {
			if (formRef.current) {
				const url = serialize(formRef.current);
				router.push(url ? "?" + url : "", undefined, { scroll: false });
			}
		}, [formRef, router]),
		formSubmitHandler = useCallback(
			(e: React.FormEvent<HTMLFormElement>) => {
				if (formRef.current) {
					e.preventDefault();
					doClientSideFormSubmit();
				}
			},
			[formRef, doClientSideFormSubmit]
		),
		// Announcement text, used for giving audible notifications to screen readers when results have changed
		[announcement, setAnnouncement] = useState(""),
		// Cache the breadcrumbs as their static and it means we can use them on the error view and success view
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

	if (results.failed)
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
					<FilterPanel
						id="filters"
						aria-label="Filter results"
						heading="Filter"
						innerRef={formRef}
						onSubmit={formSubmitHandler}
					>
						<SkipLink targetId="results">Skip to results</SkipLink>
						<input
							type="hidden"
							name="ps"
							value={pageSize === searchUrlDefaults.ps ? "" : pageSize}
						/>
						<input
							type="hidden"
							name="s"
							value={s === searchUrlDefaults.s ? "" : s}
						/>
						<InlineTextFilter
							label="Filter by title or keyword"
							name="q"
							defaultValue={q}
							placeholder="E.g. 'diabetes' or 'NG28'"
						/>
						{navigators
							.filter((nav) => nav.shortName !== "gst")
							.sort(
								(a, b) =>
									navigatorsOrder.indexOf(a.shortName) -
									navigatorsOrder.indexOf(b.shortName)
							)
							.map(({ shortName, displayName, modifiers }) => (
								<FilterGroup
									key={shortName}
									heading={displayName}
									id={shortName}
									selectedCount={
										modifiers.filter((modifier) => modifier.active).length
									}
								>
									{modifiers.map((modifier) => (
										<FilterOption
											key={modifier.displayName}
											isSelected={modifier.active}
											onChanged={doClientSideFormSubmit}
											groupId={shortName}
											value={modifier.displayName}
										>
											{`${modifier.displayName} (${modifier.resultCount})`}
										</FilterOption>
									))}
								</FilterGroup>
							))}
					</FilterPanel>
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
								destination: toggleUrl.fullUrl,
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
				</GridItem>
			</Grid>
		</>
	);
}

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
			: getActiveModifiers(results).filter(
					// We pre filter by guidance status so don't want to be able to remove it
					(mod) => mod.navigatorShortName !== "gst"
			  );

	if (results.failed) {
		logger.error(
			`Error loading guidance from search on page ${context.resolvedUrl}: ${results.errorMessage}`,
			results.debug
		);
		context.res.statusCode = 500;
	}

	return {
		props: {
			results,
			activeModifiers,
			searchUrl,
		},
	};
};

export default Published;
