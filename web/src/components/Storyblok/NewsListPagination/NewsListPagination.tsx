import { useRouter } from "next/router";
import React from "react";

import { SimplePagination } from "@nice-digital/nds-simple-pagination";

import { Link } from "@/components/Link/Link";

type NewsListPaginationProps = {
	options: {
		currentPage: number;
		totalResults: number;
		resultsPerPage: number;
	};
};

export const NewsListPagination = ({
	options: { currentPage, totalResults, resultsPerPage },
}: NewsListPaginationProps): React.ReactElement => {
	const router = useRouter();
	const { pathname, query } = router;
	const totalPages = Math.ceil(totalResults / resultsPerPage);

	const buildQueryString = (page: number): string => {
		const queryParams = {
			...query,
			page: String(page),
		};
		const queryString = new URLSearchParams(queryParams).toString();
		return queryString ? `?${queryString}` : "";
	};

	return (
		<SimplePagination
			totalPages={totalPages}
			currentPage={currentPage}
			nextPageLink={
				currentPage < totalPages
					? {
							destination: `${pathname}${buildQueryString(currentPage + 1)}`,
							elementType: Link,
					  }
					: undefined
			}
			previousPageLink={
				currentPage > 1
					? {
							destination: `${pathname}${buildQueryString(currentPage - 1)}`,
							elementType: Link,
					  }
					: undefined
			}
		/>
	);
};
