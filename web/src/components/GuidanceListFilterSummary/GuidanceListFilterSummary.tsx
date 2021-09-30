import { useRouter } from "next/router";
import { FC } from "react";

import { FilterSummary } from "@nice-digital/nds-filters";
import {
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
	defaultSortOrder: SortOrder;
}

export const GuidanceListFilterSummary: FC<GuidanceListFilterSummaryProps> = ({
	results: { firstResult, lastResult, resultCount },
	activeModifiers,
	currentSortOrder,
	defaultSortOrder,
}) => {
	const { asPath } = useRouter();

	return (
		<FilterSummary
			id="filter-summary"
			activeFilters={activeModifiers.map(({ displayName, toggleUrl }) => ({
				label: displayName,
				destination: toggleUrl,
				method: "href",
				elementType: NoScrollLink,
			}))}
			sorting={[
				{
					active:
						currentSortOrder === SortOrder.dateDescending || !currentSortOrder,
					label: "Date",
					destination: upsertQueryParam(asPath, "s", SortOrder.dateDescending),
					elementType: NoScrollLink,
				},
				{
					active: currentSortOrder === SortOrder.titleAscending,
					label: "Title",
					destination: upsertQueryParam(asPath, "s", SortOrder.titleAscending),
					elementType: NoScrollLink,
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
	);
};
