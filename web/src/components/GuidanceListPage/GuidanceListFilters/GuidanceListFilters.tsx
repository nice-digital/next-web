import serialize from "form-serialize";
import { useRouter } from "next/router";
import React, { createRef, FC, useCallback } from "react";

import {
	FilterPanel,
	FilterGroup,
	FilterOption,
} from "@nice-digital/nds-filters";
import { Navigator } from "@nice-digital/search-client";

import { InlineTextFilter } from "@/components/InlineTextFilter/InlineTextFilter";
import { SkipLink } from "@/components/SkipLink/SkipLink";
import { ToFromDateFilters } from "@/components/ToFromDateFilters/ToFromDateFilters";

/** Search returns the order of navigators depending on what's selected but we want them in a consistent order */
const navigatorsOrder = ["nai", "tt", "tsd", "ndt", "ngt", "nat"];

/** Some navigators are less used than others so collapse them by default */
const navigatorsCollapsedByDefault = ["ngt", "nat"];

export interface GuidanceListFiltersProps {
	numActiveModifiers: number;
	navigators: Navigator[];
	pageSize?: "" | number;
	sortOrder?: string;
	queryText?: string;
	from?: string;
	to?: string;
	showDateFilter: boolean;
	dateFilterLabel?: string;
	useFutureDates?: boolean;
}

export const GuidanceListFilters: FC<GuidanceListFiltersProps> = ({
	numActiveModifiers,
	navigators,
	pageSize,
	sortOrder,
	queryText,
	from,
	to,
	showDateFilter,
	dateFilterLabel,
	useFutureDates,
}) => {
	const router = useRouter(),
		formRef = createRef<HTMLFormElement>();

	const doClientSideFormSubmit = useCallback(() => {
		if (formRef.current) {
			const url = serialize(formRef.current);
			router.push(url ? "?" + url : "", undefined, { scroll: false });
		}
	}, [formRef, router]);

	const formSubmitHandler = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			if (formRef.current) {
				e.preventDefault();
				doClientSideFormSubmit();
			}
		},
		[formRef, doClientSideFormSubmit]
	);

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
			<InlineTextFilter
				label="Filter by title or keyword"
				name="q"
				defaultValue={queryText}
				placeholder="E.g. 'diabetes' or 'NG28'"
			/>
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
						collapseByDefault={navigatorsCollapsedByDefault.includes(shortName)}
						selectedCount={
							modifiers.filter((modifier) => modifier.active).length
						}
					>
						{modifiers
							.sort((a, b) => a.displayName.localeCompare(b.displayName))
							.map((modifier) => (
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
	);
};
