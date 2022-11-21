import { useRouter } from "next/router";
import { FC } from "react";

import { FilterSummary, FilterSummaryProps } from "@nice-digital/nds-filters";
import { SearchResultsSuccess, SortOrder } from "@nice-digital/search-client";

import { NoScrollLink } from "@/components/Link/Link";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface ProductListFilterSummaryProps {
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

export const ProductListFilterSummary: FC<ProductListFilterSummaryProps> = ({
	results: { firstResult, lastResult, resultCount },
	activeModifiers,
	currentSortOrder,
	defaultSort,
	secondarySort,
}) => {
	const { push, query } = useRouter();

	let sorting: FilterSummaryProps["sorting"] = undefined;

	if (secondarySort) {
		sorting = [
			{
				active: currentSortOrder === defaultSort.order || !currentSortOrder,
				label: defaultSort.label,
				onSelected: () => {
					push({
						query: { ...query, s: defaultSort.order },
					});
				},
				value: defaultSort.order,
			},
			{
				active: currentSortOrder === secondarySort.order,
				label: secondarySort.label,
				onSelected: () => {
					push({
						query: { ...query, s: secondarySort.order },
					});
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
