import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { EnhancedPagination } from "@nice-digital/nds-enhanced-pagination";
import type { SearchResultsSuccess } from "@nice-digital/search-client";
import { upsertQueryParam } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";

export interface SearchPaginationProps {
	results: SearchResultsSuccess;
}

export const SearchPagination: FC<SearchPaginationProps> = ({ results }) => {
	const { asPath } = useRouter();
	const { firstResult, resultCount, pageSize, pagerLinks } = results;
	const totalPages = Math.ceil(resultCount / pageSize);
	const generatePageActions = useCallback(() => {
		const links = [];
		for (let i = 1; i <= totalPages; i++) {
			links.push({
				pageNumber: i,
				destination: upsertQueryParam(asPath, "pa", String(i)),
			});
		}
		return links;
	}, [totalPages, asPath]);

	return (
		<EnhancedPagination
			method="href"
			elementType={({ children, ...props }) => (
				<Link scroll={false} {...props}>
					<a>{children}</a>
				</Link>
			)}
			currentPage={Math.round(firstResult / pageSize) + 1}
			totalPages={totalPages}
			pagesActions={generatePageActions()}
			nextPageAction={{
				destination: pagerLinks.next
					? upsertQueryParam(asPath, "pa", String(pagerLinks.next.pa))
					: null,
			}}
			previousPageAction={{
				destination: pagerLinks.previous
					? upsertQueryParam(asPath, "pa", String(pagerLinks.previous.pa))
					: null,
			}}
		/>
	);
};
