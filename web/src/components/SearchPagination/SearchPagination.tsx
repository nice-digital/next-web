import { useRouter } from "next/router";
import { FC } from "react";

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
	const currentPage = Math.round(firstResult / pageSize) + 1;

	const mapPageNumberToHref = (pageNumber: number) => upsertQueryParam(asPath, "pa", String(pageNumber))};

	return (
		<EnhancedPagination
			currentPage={currentPage}
			elementType={({ children, ...props }) => (
				<Link scroll={false} {...props}>
					<a>{children}</a>
				</Link>
			)}
			method="href"
			mapPageNumberToHref={mapPageNumberToHref}
			totalPages={totalPages}
		/>
	);
};
