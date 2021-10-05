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
	console.log("round ", Math.round(firstResult / pageSize) + 1);
	console.log("floor , ", Math.floor(firstResult / pageSize) + 1);
	const generatePageActions = useCallback(() => {
		const allLinks = [];
		const links = [
			{
				pageNumber: 1,
				destination: upsertQueryParam(asPath, "pa", String(1)),
			},
			{
				pageNumber: totalPages,
				destination: upsertQueryParam(asPath, "pa", String(totalPages)),
			},
		];

		const middleLinks = [];

		for (
			let i = Math.max(2, currentPage - 2);
			i <= Math.min(totalPages, Math.min(totalPages - 1, currentPage + 2));
			i++
		) {
			middleLinks.push({
				pageNumber: i,
				destination: upsertQueryParam(asPath, "pa", String(i)),
			});
		}

		links.splice(1, 0, ...middleLinks);

		console.log("links ", links);

		for (let i = 1; i <= totalPages; i++) {
			allLinks.push({
				pageNumber: i,
				destination: upsertQueryParam(asPath, "pa", String(i)),
			});
		}

		console.log("all links ", allLinks);

		return links;
	}, [totalPages, asPath]);

	return (
		<EnhancedPagination
			method="href"
			// elementType={({ children, ...props }) => (
			// 	<NiceLink scroll={false} {...props}>
			// 		<a>{children}</a>
			// 	</NiceLink>
			// )}
			currentPage={currentPage}
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
