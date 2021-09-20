import serialize from "form-serialize";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { createRef } from "react";

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
} from "@nice-digital/search-client";

import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { InlineTextFilter } from "@/components/InlineTextFilter/InlineTextFilter";
import { publicRuntimeConfig } from "@/config";
import { formatDateStr } from "@/utils/index";

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
	searchUrl: SearchUrl;
}

export function Published({
	results,
	searchUrl,
	activeModifiers,
}: PublishedGuidancePageProps): JSX.Element {
	const router = useRouter();

	if (results.failed)
		return (
			<>
				Error: todo {results.errorMessage} {results.debug?.rawResponse}
			</>
		);

	const ref = createRef();

	function submitForm() {
		console.log(serialize(ref.current));
		router.push("?" + serialize(ref.current), undefined, { scroll: false });
	}

	function handleChange() {
		submitForm();
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
		e.preventDefault();
		submitForm();
	}

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

			<Grid gutter="loose" className={styles.sectionWrapper}>
				<GridItem cols={12} md={4} lg={3} className={styles.panelWrapper}>
					<FilterPanel heading="Filter" innerRef={ref} onSubmit={handleSubmit}>
						<InlineTextFilter
							label="Filter by title"
							name="q"
							defaultValue={searchUrl.q}
							placeholder="Enter title or keyword"
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
										onChanged={handleChange}
										value={modifier.displayName}
									>
										{modifier.displayName}
									</FilterOption>
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
							{results.documents.map(
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
													<span>{formatDateStr(String(publicationDate))}</span>
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
		index: "guidance",
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
			searchUrl,
		},
	};
};

export default Published;
