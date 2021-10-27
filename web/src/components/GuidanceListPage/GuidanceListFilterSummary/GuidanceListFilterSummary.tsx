import { useRouter } from "next/router";
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
	const { asPath } = useRouter();

	let sorting: FilterSummaryProps["sorting"] = undefined;

	if (secondarySort) {
		sorting = [
			{
				active: currentSortOrder === defaultSort.order || !currentSortOrder,
				label: defaultSort.label,
				destination: removeQueryParam(asPath, "s"),
				elementType: NoScrollLink,
			},
			{
				active: currentSortOrder === secondarySort.order,
				label: secondarySort.label,
				destination: upsertQueryParam(asPath, "s", secondarySort.order),
				elementType: NoScrollLink,
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
		></FilterSummary>
	);
};
