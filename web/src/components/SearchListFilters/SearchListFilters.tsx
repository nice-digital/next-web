import serialize from "form-serialize";
import { useRouter } from "next/router";
import React, { createRef, FC, useCallback, useState } from "react";

import {
	FilterPanel,
	FilterGroup,
	FilterOption,
} from "@nice-digital/nds-filters";
import {
	Navigator,
	KnownOrModifierKeys,
	Modifier,
	SearchIndex,
} from "@nice-digital/search-client";

import { InlineTextFilter } from "@/components/InlineTextFilter/InlineTextFilter";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { ToFromDateFilters } from "@/components/ToFromDateFilters/ToFromDateFilters";
import { ProductTypeAcronym } from "@/feeds/publications/types";

/** Search returns the order of navigators depending on what's selected but we want them in a consistent order */
// const navigatorsOrder = ["nai", "tt", "tsd", "ndt", "ngt", "nat"];

/** Some navigators are less used than others so collapse them by default */
const navigatorsCollapsedByDefault = ["ngt", "nat"];

export interface SearchListFiltersProps {
	numActiveModifiers: number;
	navigators: Navigator[];
	pageSize?: "" | number;
	sortOrder?: string;
	queryText?: string;
	from?: string;
	to?: string;
	navigatorShortNamesToExclude?: string;
	showDateFilter: boolean;
	showTextFilter: boolean;
	dateFilterLabel?: string;
	useFutureDates?: boolean;
	navigatorsOrder: KnownOrModifierKeys[];
	index?: SearchIndex;
}

export const SearchListFilters: FC<SearchListFiltersProps> = ({
	numActiveModifiers,
	navigators,
	pageSize,
	sortOrder,
	queryText,
	from,
	to,
	navigatorShortNamesToExclude,
	showDateFilter,
	showTextFilter,
	dateFilterLabel,
	useFutureDates,
	navigatorsOrder,
	index,
}) => {
	const router = useRouter(),
		formRef = createRef<HTMLFormElement>();

	const [lastUpdatedChecked, setLastUpdatedChecked] = useState({});

	const doClientSideFormSubmit = useCallback(
		(lastUpdated?: string | null) => {
			Array.prototype.forEach.call(formRef.current, (element) => {
				if (
					lastUpdated &&
					element.name === "drm" &&
					element.value !== lastUpdated
				) {
					element.checked = false;
				}
			});

			if (lastUpdated && formRef.current) {
				setLastUpdatedChecked(lastUpdated);
			}
			if (formRef.current) {
				const url = serialize(formRef.current);
				router.push(url ? "?" + url : "", undefined, { scroll: false });
			}
		},
		[formRef, router]
	);

	const formSubmitHandler = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			if (formRef.current) {
				e.preventDefault();
				doClientSideFormSubmit();
			}
		},
		[formRef, doClientSideFormSubmit]
	);

	const lastUpdatedModifiersSortOrder = [
		"Last 3 months",
		"Last 6 months",
		"Last year",
		"Last 3 years",
	];

	const checkActive = (modifier: Modifier, modifiers: Modifier[]) => {
		if (lastUpdatedChecked) {
			modifiers.forEach((modifier) => {
				if (modifier.displayName !== lastUpdatedChecked) {
					modifier.active = false;
				}
			});
			return modifier.displayName === lastUpdatedChecked;
		} else {
			return modifier.active;
		}
	};

	let productTypeAcronym;

	switch (index) {
		case "guidance":
			productTypeAcronym = ProductTypeAcronym.NG;
			break;
		case "indicators":
			productTypeAcronym = ProductTypeAcronym.IND;
			break;
		default:
			productTypeAcronym = ProductTypeAcronym.NG;
			break;
	}

	return (
		<FilterPanel
			id="filters"
			aria-label="Filter results"
			heading={`Filter${
				numActiveModifiers === 0 ? "" : ` (${numActiveModifiers} active)`
			}`}
			innerRef={formRef}
			onSubmit={formSubmitHandler}
		>
			<SkipLink targetId="results">Skip to results</SkipLink>
			<input type="hidden" name="ps" value={pageSize} />
			<input type="hidden" name="s" value={sortOrder} />
			{showTextFilter ? (
				<InlineTextFilter
					label="Filter by title or keyword"
					name="q"
					defaultValue={queryText}
					placeholder={`E.g. 'diabetes' or '${productTypeAcronym}28'`}
				/>
			) : (
				<input type="hidden" name="q" value={queryText} />
			)}
			{showDateFilter ? (
				<ToFromDateFilters
					heading={dateFilterLabel}
					from={from}
					to={to}
					useFutureDates={!!useFutureDates}
				/>
			) : (
				<></>
			)}

			{navigators
				.filter((nav) => nav.shortName !== navigatorShortNamesToExclude)
				.sort(
					(a, b) =>
						navigatorsOrder.indexOf(a.shortName as KnownOrModifierKeys) -
						navigatorsOrder.indexOf(b.shortName as KnownOrModifierKeys)
				)
				.map(({ shortName, displayName, modifiers }) => (
					<FilterGroup
						key={shortName}
						heading={displayName}
						id={shortName}
						collapseByDefault={navigatorsCollapsedByDefault.includes(shortName)}
						selectedCount={
							modifiers.filter((modifier) => modifier.active).length
						}
					>
						{modifiers
							.sort((a, b) => a.displayName.localeCompare(b.displayName))
							.sort(
								(a, b) =>
									lastUpdatedModifiersSortOrder.indexOf(a.displayName) -
									lastUpdatedModifiersSortOrder.indexOf(b.displayName)
							)
							.map((modifier) => {
								return (
									<FilterOption
										key={modifier.displayName}
										isSelected={
											shortName == "drm"
												? checkActive(modifier, modifiers) && modifier.active
												: modifier.active
										}
										onChanged={() => {
											window.dataLayer &&
												window.dataLayer.push({
													event: "search.filter-select",
													filter: modifier.displayName,
													action: modifier.active ? "deselected" : "selected",
												});
											doClientSideFormSubmit(
												shortName == "drm" ? modifier.displayName : null
											);
										}}
										groupId={shortName}
										value={modifier.displayName}
									>
										{`${modifier.displayName} (${modifier.resultCount})`}
									</FilterOption>
								);
							})}
					</FilterGroup>
				))}
		</FilterPanel>
	);
};
