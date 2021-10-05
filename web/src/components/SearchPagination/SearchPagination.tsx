import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { EnhancedPagination } from "@nice-digital/nds-enhanced-pagination";
import type { SearchResultsSuccess } from "@nice-digital/search-client";
import { upsertQueryParam } from "@nice-digital/search-client";

import { Link as NiceLink } from "@/components/Link/Link";

export interface SearchPaginationProps {
	results: SearchResultsSuccess;
}

export const SearchPagination: FC<SearchPaginationProps> = ({ results }) => {
	const { asPath } = useRouter();
	const { firstResult, resultCount, pageSize, pagerLinks } = results;
	const totalPages = Math.ceil(resultCount / pageSize);
	const currentPage = Math.round(firstResult / pageSize) + 1;

	const generatePageActions = useCallback(() => {
		const rangeStartNumber = Math.max(2, currentPage - 2);
		const rangeEndNumber = Math.min(
			totalPages,
			Math.min(totalPages - 1, currentPage + 2)
		);
		const links = [
			{
				pageNumber: 1,
				destination: upsertQueryParam(asPath, "pa", String(1)),
			},
			...Array.from(
				{ length: rangeEndNumber - rangeStartNumber + 1 },
				(_v, index) => {
					return {
						pageNumber: rangeStartNumber + index,
						destination: upsertQueryParam(
							asPath,
							"pa",
							String(rangeStartNumber + index)
						),
					};
				}
			),
			{
				pageNumber: totalPages,
				destination: upsertQueryParam(asPath, "pa", String(totalPages)),
			},
		];
		return links;
	}, [totalPages, asPath, currentPage]);

	return (
		<EnhancedPagination
			currentPage={currentPage}
			elementType={({ children, ...props }) => (
				<NiceLink scroll={false} {...props}>
					<a>{children}</a>
				</NiceLink>
			)}
			method="href"
			nextPageAction={{
				destination: pagerLinks.next
					? upsertQueryParam(asPath, "pa", String(pagerLinks.next.pa))
					: null,
			}}
			pagesActions={generatePageActions()}
			previousPageAction={{
				destination: pagerLinks.previous
					? upsertQueryParam(asPath, "pa", String(pagerLinks.previous.pa))
					: null,
			}}
			totalPages={totalPages}
		/>
	);
};
