import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import {
	FilterPanel,
	FilterGroup,
	FilterByInput,
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
} from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { publicRuntimeConfig } from "@/config";
import { formatDateStr, removeGuidanceReference } from "@/utils/index";

import styles from "./published.module.scss";

import type { Except } from "type-fest";

const searchUrlDefaults: Except<SearchUrl, "fullUrl" | "route"> = {
	s: "Date",
	om: `[{"gst":["Published"]}]`,
	ps: 10,
};

interface PublishedGuidancePageProps {
	results: SearchResults;
	activeModifiers: Modifier[];
}

export default function Published({
	results,
	activeModifiers,
}: PublishedGuidancePageProps): JSX.Element {
	if (results.failed)
		return (
			<>
				Error: todo {results.errorMessage} {results.debug?.rawResponse}
			</>
		);

	return (
		<>
			<NextSeo title="Published guidance, quality standards and advice" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb>
					Published guidance, quality standards and&nbsp;advice
				</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				preheading="Published"
				heading="Guidance, quality standards and&nbsp;advice"
			/>

			<GuidanceListNav />

			<Grid gutter="loose">
				<GridItem cols={12} md={4} lg={3}>
					<FilterPanel heading="Filter">
						<FilterByInput
							name="q"
							label="Filter by title"
							buttonLabel="Filter by title"
						/>
						{results.navigators.map(({ shortName, displayName, modifiers }) => (
							<FilterGroup
								key={shortName}
								heading={displayName}
								selectedCount={
									modifiers.filter((modifier) => modifier.active).length
								}
							>
								{modifiers.map((modifier) => (
									<FilterOption
										key={modifier.displayName}
										isSelected={modifier.active}
										onChanged={() => {
											/* what */
										}}
										value={modifier.displayName}
									>
										{modifier.displayName}
									</FilterOption>
									// <li key={modifier.displayName}>
									// 	<Link href={modifier.toggleUrl.fullUrl}>
									// 		<a>{modifier.displayName}</a>
									// 	</Link>
									// </li>
								))}
							</FilterGroup>
						))}
					</FilterPanel>
				</GridItem>
				<GridItem cols={12} md={8} lg={9}>
					<FilterSummary
						id="filter-summary"
						activeFilters={activeModifiers.map((modifier) => ({
							label: modifier.displayName,
							destination: modifier.toggleUrl.fullUrl,
						}))}
						sorting={[{ label: "Date" }, { label: "Title" }]}
					>
						Showing {results.firstResult} to {results.lastResult} of{" "}
						{results.resultCount}
					</FilterSummary>

					<Table aria-describedby="filter-summary">
						<thead>
							<tr>
								<th>Title</th>
								<th>Reference Number</th>
								<th>Published</th>
								<th>Last updated</th>
							</tr>
						</thead>
						<tbody>
							{results.documents.map(
								({
									id,
									title,
									guidanceRef,
									publicationDate,
									lastUpdated,
									sourceUrl,
								}) => {
									const strippedTitle = guidanceRef
										? title.replace(`(${guidanceRef})`, "").trim()
										: title;
									return (
										<tr key={id}>
											<td>
												<a href={sourceUrl}>{strippedTitle}</a>
											</td>
											<td>{guidanceRef}</td>
											<td>
												<time dateTime={String(lastUpdated)}>
													<span className={styles.longTime}>
														{formatDateStr(String(publicationDate))}
													</span>
													<span className={styles.shortTime}>
														{formatDateStr(String(publicationDate), true)}
													</span>
												</time>
											</td>
											<td>
												<time dateTime={String(lastUpdated)}>
													<span className={styles.longTime}>
														{formatDateStr(String(lastUpdated))}
													</span>
													<span className={styles.shortTime}>
														{formatDateStr(String(lastUpdated), true)}
													</span>
												</time>
											</td>
										</tr>
									);
								}
							)}
						</tbody>
					</Table>
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<{ props: PublishedGuidancePageProps }> => {
	initialise({
		baseURL: publicRuntimeConfig.search.baseURL,
		index: "nice",
	});

	const searchUrl: SearchUrl = {
			...searchUrlDefaults,
			...getSearchUrl(context.resolvedUrl),
		},
		results = await search(searchUrl),
		activeModifiers = results.failed ? [] : getActiveModifiers(results);

	return {
		props: {
			results,
			activeModifiers,
		},
	};
};
