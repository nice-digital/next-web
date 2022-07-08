import router, { useRouter } from "next/router";
import { FC } from "react";

import { FilterSummary, FilterSummaryProps } from "@nice-digital/nds-filters";
import {
	removeQueryParam,
	SearchResultsSuccess,
	SortOrder,
	upsertQueryParam,
} from "@nice-digital/search-client";

import { NoScrollLink } from "@/components/Link/Link";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface GuidanceListFilterSummaryProps {
	results: SearchResultsSuccess;
	activeModifiers: ActiveModifier[];
	currentSortOrder?: string;
	defaultSort: {
		order: SortOrder;
		label: string;
	};
	secondarySort?: {
		order: SortOrder;
		label: string;
	};
}

export const GuidanceListFilterSummary: FC<GuidanceListFilterSummaryProps> = ({
	results: { firstResult, lastResult, resultCount },
	activeModifiers,
	currentSortOrder,
	defaultSort,
	secondarySort,
}) => {
	const { push, pathname, query } = useRouter();

	// Update query params and refresh page
	const navigate = (sortOrder: SortOrder) => {
		push({
			pathname,
			query: { ...query, s: sortOrder },
		});
	};

	let sorting: FilterSummaryProps["sorting"] = undefined;

	if (secondarySort) {
		sorting = [
			{
				active: currentSortOrder === defaultSort.order || !currentSortOrder,
				label: defaultSort.label,
				onSelected: () => {
					navigate(defaultSort.order);
				},
				value: defaultSort.order,
			},
			{
				active: currentSortOrder === secondarySort.order,
				label: secondarySort.label,
				onSelected: () => {
					navigate(secondarySort.order);
				},
				value: secondarySort.order,
			},
		];
	}

	return (
		<FilterSummary
			id="filter-summary"
			activeFilters={activeModifiers.map(({ displayName, toggleUrl }) => ({
				label: displayName,
				destination: toggleUrl,
				method: "href",
				elementType: NoScrollLink,
			}))}
			sorting={sorting}
		>
			{resultCount === 0 ? (
				"No results found"
			) : (
				<>
					Showing {firstResult} to {lastResult} of {resultCount}
				</>
			)}
		</FilterSummary>
	);
};
