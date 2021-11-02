import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { EnhancedPagination } from "@nice-digital/nds-enhanced-pagination";
import {
	removeQueryParam,
	SearchResultsSuccess,
	upsertQueryParam,
} from "@nice-digital/search-client";

import { ScrollToLink } from "@/components/Link/Link";

export interface SearchPaginationProps {
	results: SearchResultsSuccess;
	scrollTargetId: string;
}

export const SearchPagination: FC<SearchPaginationProps> = ({
	results: { firstResult, resultCount, pageSize },
	scrollTargetId,
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
			elementType={(props) => (
				<ScrollToLink {...props} scrollTargetId={scrollTargetId} />
			)}
			currentPage={currentPage}
			totalPages={totalPages}
			mapPageNumberToHref={mapPageNumberToHref}
		/>
	);
};
