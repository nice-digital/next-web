import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { EnhancedPagination } from "@nice-digital/nds-enhanced-pagination";
import {
	removeQueryParam,
	SearchResultsSuccess,
	upsertQueryParam,
} from "@nice-digital/search-client";

import { NoScrollLink } from "@/components/Link/Link";

export interface SearchPaginationProps {
	results: SearchResultsSuccess;
}

export const SearchPagination: FC<SearchPaginationProps> = ({
	results: { firstResult, resultCount, pageSize },
}) => {
	const { asPath } = useRouter(),
		totalPages = Math.ceil(resultCount / pageSize),
		currentPage = Math.ceil(firstResult / pageSize),
		mapPageNumberToHref = useCallback(
			(pageNumber: number) =>
				pageNumber === 1
					? removeQueryParam(asPath, "pa")
					: upsertQueryParam(asPath, "pa", String(pageNumber)),
			[asPath]
		);

	return (
		<EnhancedPagination
			elementType={NoScrollLink}
			currentPage={currentPage}
			totalPages={totalPages}
			mapPageNumberToHref={mapPageNumberToHref}
		/>
	);
};
